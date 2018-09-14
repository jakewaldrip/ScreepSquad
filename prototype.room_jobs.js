/** @namespace Room_Jobs */
//Requires that room.getData() has been run.

//get job queue for miners
//returns [ [id, state], [], ... ]
Room.prototype.getMinerJobQueue = function () {
    
	//get sources from memory
    let sources = _.map(Object.keys(this.memory.sources), id => Game.getObjectById(id));

	//get miners in room
    let miners = _.filter(Game.creeps, creep => 
    ( (creep.memory.role === "miner" || creep.memory.role === "remoteMiner" )
    && (creep.memory.homeRoom === this.name || creep.memory.remoteRoom == this.name ) ), this);
    
	//get the sources we're targeting
    let targetSources = _.filter(sources, function(source) {
        
        let minersTargeting = _.remove(miners, miner => miner.memory.workTarget === source.id);
        
        if(minersTargeting.length > 0){
             
			 //check if the source is saturated
             if(_.sum(minersTargeting, c => 
                c.getActiveBodyparts(WORK)) < (source.energyCapacity / 600)
                && minersTargeting.length < this.memory.sources[source.id].accessTiles.length ){ //600 = 300 ticks * 2 energy/part/tick
                
                 return true;
             
                    
            }
             else{
                 
                 return false;
                 
            }
             
        }
        
        else{
            
            return true;
            
        }
        
    }, this);
    
    this.memory.jobQueues.minerJobs = {};
    
	//save each non saturated source in the job queue
    for(i = 0; i < targetSources.length; i++)
        this.memory.jobQueues.minerJobs[targetSources[i].id] = "STATE_HARVESTING";
        
}
//----


//get job queue for drones
Room.prototype.getDroneJobQueue = function () {
    let fillStructures = _.filter(this.structures, s => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity));
    
    fillStructures = removeClaimedJobs(fillStructures);
    
    let formattedStructures = {};
    
    _.forEach(fillStructures, s => formattedStructures[s.id] = "STATE_USE_RESOURCES");
    
    this.memory.jobQueues.droneJobs = formattedStructures;
}
//----


//get job queue for workers
//Priority: Repairs under 50% hp, construction sites, repairs under 75% hp, controller upgrading
// Returns [ [id, action], [], ... ] 
Room.prototype.getWorkerJobQueue = function () {
    
    let constSites = _.map(this.memory.constructionSites, id => Game.getObjectById(id));
    
    let repairTargets = _.map(Object.keys(this.memory.repairTargets), id => Game.getObjectById(id));
    _.filter(repairTargets, rt => this.memory.repairTargets[rt.id] < .75);
    
    repairTargets = _.sortBy(repairTargets, s => this.memory.repairTargets[s.id], this);
    repairTargets = removeClaimedJobs(repairTargets);
    
    let priorityRepairTargets = _.takeWhile(repairTargets, s => this.memory.repairTargets[s.id] < .50);
    
    
    let lowTowers = _.map(this.memory.structures[STRUCTURE_TOWER], id => Game.getObjectById(id));
    lowTowers = _.filter(lowTowers, tower => tower.energy < tower.energyCapacity);
    lowTowers = removeClaimedJobs(lowTowers);
    
    let controller = [this.controller];
    controller = removeClaimedJobs(controller);
    
    
    let targets = controller.concat(lowTowers, priorityRepairTargets, constSites, repairTargets);
    
    
    let formattedTargets = {"controller": {}, "towers": {}, "priorityRepairs": {}, "constSites": {}, "repairs": {} };
    
    _.forEach(controller, t => formattedTargets.controller[t.id] = "Controller");
    _.forEach(lowTowers, t => formattedTargets.towers[t.id] = ( t.energyCapacity - t.energy ) );
    _.forEach(priorityRepairTargets, t => formattedTargets.priorityRepairs[t.id] = "PriorityRepair" );
    _.forEach(constSites, t => formattedTargets.constSites[t.id] = ( t.progressTotal - t.progress ) );
    _.forEach(repairTargets, t => formattedTargets.repairs[t.id] = "Repair" );
    
    //console.log(JSON.stringify(formattedTargets));
    this.memory.jobQueues.workerJobs = formattedTargets;
    
}
//----


//get energy targets for STATE_GET_ENERGY
//returns [ [id, dropType], [], ... ]
Room.prototype.getEnergyJobQueue = function() {
    const MIN_TARGET_AMOUNT = 300;
    
    let dropArray = [], 
        containerArray = [], 
        mergedArray = [];
        
    dropArray = _.map(Object.keys(this.memory.droppedEnergy), id => Game.getObjectById(id));
    
    if (this.memory.structures[STRUCTURE_CONTAINER].length > 0){
        
        containerArray = _.map(this.memory.structures[STRUCTURE_CONTAINER], id => Game.getObjectById(id));
        
    }
    
    mergedArray = dropArray.concat(containerArray);
    
    let sortedArray = _.sortBy(mergedArray, function(obj) {
        
        if(obj instanceof Energy){
            return obj.amount;
        }
        else {
            return obj.store[RESOURCE_ENERGY];
        }
        
    });
    
    /*
    //Insert storage into the job queue at MIN_TARGET_AMOUNT of energy.
    //This allows us to prioritize containers and drops before we use storage.
    if (this.storage){
        
        let index = _.sortedIndex(sortedArray, MIN_TARGET_AMOUNT, function(obj) {
            
            if(obj instanceof Energy){
                return obj.amount;
            }
            else if(obj instanceof Structure){
                return obj.store[RESOURCE_ENERGY];
            }
            else{
                return obj;
            }
            
        });
        sortedArray.splice(index, 0, this.storage);
        
    }
    */
    //get array into descending order
    sortedArray.reverse();
    
    let formattedEnergy = {};
    
    _.forEach(sortedArray, function(obj) {
        if(obj instanceof Energy){
            formattedEnergy[obj.id] = obj.amount;
        }
        else{
            formattedEnergy[obj.id] = obj.store[RESOURCE_ENERGY];
        }
    });
    
    this.memory.jobQueues.getEnergyJobs = formattedEnergy;
}
//----

//Takes an array of ids
//Removes any ids that are being targetted by a creep already.
const removeClaimedJobs = function(checkValues){
    let returnValues = [];
    
    for(i = 0; i < checkValues.length; i++){ 
        let value = checkValues[i];
        //catch objects passed instead of id strings
        if(value.id)
            value = value.id;
            
        //might need to unshift instead of push here
        if(!_.any(Game.creeps, creep => creep.workTarget == value) )
            returnValues.push(checkValues[i]);
    }
    
    return returnValues;
}

//Use Job Queues
//--------------------------------------------------------------------------------------------//

//Generic assignJob
Room.prototype.getWorkJob = function(role){
    //catches creep object being passed 
    if(role instanceof Creep)
        role = role.role;
    
    if(!this.memory.jobQueues[role + "Jobs"]){
        
        let funct = "get" + role.capitalizeFirst() + "JobQueue";
        this[funct].call(this);
        
    }
    
    let jobQueue = [];
    jobQueue = _.pairs( this.jobQueues[role + "Jobs"] );
      
    let job = [null, null];
    
    if(jobQueue.length > 0){
            
        job = jobQueue.shift();
        
        let value = parseInt(job[1], 10);
        
        if(!isNaN(value))
            this.jobQueues[role + "Jobs"][job[0]] -= 500;
        
        if(isNaN(value) || (value - 500 <= 0) )
            delete this.jobQueues[role + "Jobs"][job[0]];
        
    }
    //things to do if there are no jobs available, per role
    else if(role == "worker"){
        job[0] = this.controller.id;
    }
    else if(role == "drone"){
            
            if(!this.storage){
                //pretend you're a worker for a tick
                job[0] = this.getWorkJob("worker");
                
            }
            else{
                
                job[0] = this.storage.id;
                
            }
    }
    
    return job[0];
}

Creep.prototype.getWorkJob = function(role) {
    
    //allows you to get a job from another role
    if(role == undefined)
        role = this.memory.role;
    
    //get the jobQueue for the role    
    var jobQueue = this.getJobQueue(role);
    
    //creates/calls the function for the role specific getJob
    //Ex. this.getDroneJob(jobQueue); ** The "this" tells the new function its scope
    let funct = "get" + role.capitalizeFirst() + "Job";
    var jobID = this[funct].call(this, jobQueue);
    
    return jobID;
}

//Gets called from Creep.getWorkJob(role).
// @params role - should always be defined
Creep.prototype.getJobQueue = function(role) {

    //inits workQueue for role
    if(!this.room.memory.jobQueues[role + "Jobs"]){
        let funct = "get" + role.capitalizeFirst() + "JobQueue";
        this.room[funct].call(this.room);
    }
    
    return this.room.memory.jobQueues[role + "Jobs"];
    
}

//Reduces or deletes the job from jobQueue memory
Creep.prototype.diminishJob = function(job, jobQueue){
    
    //remove carry capacity from the value stored in memory
        let value = parseInt(jobQueue[job.id], 10);
            
        if(!isNaN(value)){
            value -= this.carryCapacity;
            jobQueue[job.id] -= value;
        }
        //delete if value drops below 0
        if(isNaN(value) || value <= 0)
            delete jobQueue[job.id];
            
}


Creep.prototype.getWorkerJob = function(jobQueue) {
    
    var job = null;
    
    var controller = Object.keys(jobQueue.controller).getObjects();
    job = this.getClosest(controller);
    
    if(job == null){
        var lowTowers = Object.keys( jobQueue.towers ).getObjects();
        job = this.getClosest(lowTowers);
    }
    
    if(job == null)    {
        var priorityRepairs = Object.keys( jobQueue.priorityRepairs ).getObjects();
        job = this.getClosest(priorityRepairs);   
    }
    
    if(job == null) {
        var constSites = Object.keys( jobQueue.constSites ).getObjects();
        job = this.getClosest(constSites);
    }
    
    if(job == null) {
        var repairs = Object.keys( jobQueue.repairs ).getObjects();
        job = this.getClosest(repairs);
    }
    
    //Remove the job from the queueif appropriate
    if(job != null){
        this.diminishJob(job, jobQueue)
    }
    
    if(job == null)
        job = this.room.controller;
    
    return job.id;
}


// If there are no jobs, targets storage
// If there is no storage, acts as a Worker.
Creep.prototype.getDroneJob = function(jobQueue) {
    
    var objects = Object.keys(jobQueue).getObjects();
    
    var job = this.getClosest(objects);
    
    if(job != null){
        
        this.diminishJob(job, jobQueue);
        
    }
    else if(!this.room.storage){
        //pretend you're a worker for a tick
        job = Game.getObjectById(this.getWorkJob("worker"));
            
    }
    else{
        //drop off at storage
        job = this.room.storage;
            
    }
    
    return job.id;
}

// Will only act as long as there is a job in queue.
Creep.prototype.getMinerJob = function(jobQueue){
    
    var objects = Object.keys(jobQueue).getObjects();
    
    var job = this.getClosest(objects);
    
    if( job != null )
        this.diminishJob(job, jobQueue);
        
    if(job != null)
        return job.id;
    else
        return null;
    
}

//Creeps choose the closest energy source(container/storage/drops)
//removing their carryCapacity from the value stored in memory
//deleting it from the jobQueue if it is considered empty.
Creep.prototype.getEnergyJob = function() {
    
    /** The level at which non-drones will pull from storage instead of gather from containers */
    const STORAGE_THRESHOLD = 1300;
    
    if(!this.room.memory.jobQueues["getEnergyJobs"]){
        this.room.getEnergyJobQueue();
    }
    
    var jobQueue = this.room.memory.jobQueues["getEnergyJobs"];
    
    //get the objects of the jobQueue
    var objects = Object.keys(jobQueue).getObjects();
    
    //seperate storage from objects
    var storage = null;
    if(this.room.storage)
        storage = this.room.storage;
        
    var job;
    
    //remoteDrones get biggest energy, all else get closest
    if(this.memory.role == "remoteDrone" || this.memory.role == "drone")
        job = _.max(objects, o => o.energyAvailable() );    
    else
        job = this.getClosest(objects);
    
    var canAccessStorage = false;

    if(this.memory.role != "drone" && ( job == null || job == undefined || job.energyAvailable() < STORAGE_THRESHOLD)){
        canAccessStorage = true;
    }
    else if(this.memory.role == "drone" && ( job == null || job == undefined || job.energyAvailable() < this.carryCapacity*.75 )){
        canAccessStorage = true;
    }
    //possible consequences
    //Drone grabs from storage to fill storage
    
    if( storage != null && canAccessStorage){
        
        job = storage;
        
    }
    
    if(job != undefined) 
        this.diminishJob(job, jobQueue);
    
    
    if(job != null)
        return job.id;
    else
        return null;
    
}

/** 
 * Finds the minimum distance object from Creep
 * 
 * @param Object[] objects array of 'pos' objects or objects with a 'pos' property. 
 * @return Object or null
 */
Creep.prototype.getClosest = function(objects){
    
    var closest = null, minRange = Infinity;

    for(i = 0; i < objects.length; i++){
        
        let obj = objects[i];
        
        var range = this.pos.getRangeTo(obj);
        
        if(range < minRange) {
            //only target it if it has enough to fill your inventory, or is incomplete/not full
            //if(i.energy < i.energyCapacity || i.progress < i.progressTotal || i.energyAvailable() >= this.carryCapacity ){
                
                minRange = range;
                closest = obj;
                
            //}
        }
        
        //stop on the first object within 1 tile for efficiency
        if(minRange <= 1){ break; } 
        
    }
    
    return closest;
}



//---------------------------------------------------------------------------------------
//Remote Job Functions

Creep.prototype.getRemoteWorkJob = function() {
    
    switch(this.memory.role) {
        
        case 'remoteMiner':
            //Should work exactly like regular miner
            return this.getWorkJob("miner");
        
        break;
        
        
        case 'remoteDrone':
            
            if(this.room.name != this.memory.homeRoom){
                //Target center of homeRoom
                return {x: 25, y: 25, roomName: this.memory.homeRoom};
            }
            else{
                
                //find closest link
                //we find closest because all that matters is the upgraders link is filled
                //so if its a shorter walk for whatever reason to just go to controller then
                //we will do this instead
                let allLinksID = this.room.memory.structures[STRUCTURE_LINK];
                let allLinks = allLinksID.getObjects();
                let closestLink = this.pos.findClosestByRange(allLinks);

                //check if link exists and isn't full
                if(closestLink != null && closestLink.energy < closestLink.energyCapacity){

                    return closestLink.id;
                }
                else{
                
                    //if link doesn't exist or full, fill storage
                    let homeRoom = Game.rooms[this.memory.homeRoom];
                    
                    if(homeRoom.storage != undefined){
                        
                        return homeRoom.storage.id;
                    }
                    else{
                    
                        console.log(this.name + ": No storage found!");
                    }
                }
            }
        break;
        
        
        case 'remoteReserver':
            
            if(this.room.controller != undefined)
                return this.room.controller.id;
            else
                console.log(this.name + ": No controller found!");
                
        break;
        
        
        default:
        
            console.log(this.name + " is an invalid creep for Creep.prototype.getRemoteWorkJob");
            
        break;
        
    }
    
}
