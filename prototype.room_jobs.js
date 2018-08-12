
//Requires that room.getData() has been run.

//get job queue for miners
//returns [ [id, state], [], ... ]
Room.prototype.getMinerJobQueue = function () {
    
    
    let sources = _.map(Object.keys(this.memory.sources), id => Game.getObjectById(id));
    
    let miners = _.filter(Game.creeps, creep => (creep.memory.role === "miner" && creep.memory.homeRoom === this.name), this);
    
    let targetSources = _.filter(sources, function(source) {
        
        let minersTargeting = _.remove(miners, miner => miner.memory.workTarget === source.id);
        
        if(minersTargeting.length > 0){
             
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
//Priority: Repairs under 75% hp, construction sites, repairs over 75% hp, controller upgrading
// Returns [ [id, action], [], ... ] 
Room.prototype.getWorkerJobQueue = function () {
    
    let constSites = _.map(this.memory.constructionSites, id => Game.getObjectById(id));
    
    /* New system doesn't support sorting
    //Primary sort by structureType (a-z) and then by progress ( 99.9 -> 0.0 )
    constSites = _.sortByAll(constSites, cs => [cs.structureType, 
                            (cs.progress / cs.progressTotal) - 1]);
    */
    
    let repairTargets = _.map(Object.keys(this.memory.repairTargets), id => Game.getObjectById(id));
    _.filter(repairTargets, rt => this.memory.repairTargets[rt.id] < .75);
    
    repairTargets = _.sortBy(repairTargets, s => this.memory.repairTargets[s.id], this);
    
    
    let priorityRepairTargets = _.takeWhile(repairTargets, s => this.memory.repairTargets[s.id] < .50);
    
    
    let lowTowers = _.map(this.memory.structures[STRUCTURE_TOWER], id => Game.getObjectById(id));
    lowTowers = _.filter(lowTowers, tower => tower.energy < tower.energyCapacity);
    
    let controller = [this.controller];
    controller = removeClaimedJobs(controller);
    
    let targets = controller.concat(lowTowers, priorityRepairTargets, constSites, repairTargets);
    
    //console.log("Before dupe removal: " + targets);
    //targets = removeClaimedJobs(targets);
    //console.log("After dupe removal: " + targets);
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

/*

// Requires at least one creep to be upgrading controller at all times.
// Others choose the closest job in the queue, and controller if no targets.
Creep.prototype.getWorkerJob = function(jobQueue) {
    
    var objects = Object.keys(jobQueue).getObjects();
    
    //if the first item in the queue is the controller
    //then we know that there isn't a creep upgrading.
    var upgrading = (objects[0] != this.room.controller);
    
    //check if any of the items in the list are a tower
    //returns the ID of the tower if there is one.
    var lowTower = _.find(this.room.memory.structures[STRUCTURE_TOWER], function(towerID) {

        if( _.some(objects, obj => obj.id == towerID) )
            return true;
        else{
            return false;
        }
        
    });
    
    var job;
    //Targets controller -> lowTowers -> others
    if( !upgrading )
        job = this.room.controller;
    else if( lowTower ){
        job = Game.getObjectById(lowTower);
    }
    else{
        job = this.getClosest(objects);
    }
    
    
    if(job != null){
        
        this.diminishJob(job, jobQueue);
        
    }
    else
        job = this.room.controller;
        
    
    return job.id;
}

*/

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
    
    const STORAGE_THRESHOLD = 1000;
    
    if(!this.room.memory.jobQueues["getEnergyJobs"]){
        this.room.getEnergyJobQueue();
    }
    
    var jobQueue = this.room.memory.jobQueues["getEnergyJobs"];
    
    //get the objects of the jobQueue
    var objects = Object.keys(jobQueue).getObjects();
    
    //filter objects smaller than STORAGE_THRESHOLD if not a drone
    if(this.memory.role != "drone")
        _.filter(objects, o => o.energyAvailable() < STORAGE_THRESHOLD);
        
    //seperate storage from objects
    var storage = null;
    if(this.room.storage)
        storage = this.room.storage;
        
    var job = this.getClosest(objects);
    
    //If job is too small, and you aren't a drone, target storage if it exists and has more than creeps carryCapacity
    if( (job == null || job.energyAvailable() < STORAGE_THRESHOLD)
    && this.memory.role != "drone"
    && storage != null && storage.energyAvailable() > this.carryCapacity){
        
        job = storage;
        
    }
    
    if(job != undefined) 
        this.diminishJob(job, jobQueue);
    
    if(job != null)
        return job.id;
    else
        return null;
    
}

Creep.prototype.getClosest = function(objects){
    
    //Loop through each object and get the minimum distance object
    var closest = null, minRange = Infinity;

    for(i = 0; i < objects.length; i++){
        obj = objects[i];
        var range = this.pos.getRangeTo(obj);
        
        if(range < minRange) {
            //only target it if it has enough to fill your inventory, or is incomplete/not full
            //if(i.energy < i.energyCapacity || i.progress < i.progressTotal || i.energyAvailable() >= this.carryCapacity ){
                
                minRange = range;
                closest = obj;
                
            //}
        }
        
        //stop on the first object within 3 tiles for efficiency
        if(minRange <= 3){ break; } 
        
    }
    
    return closest;
}



//---------------------------------------------------------------------------------------
//Remote Job Functions

Creep.prototype.getRemoteWorkJob = function() {
    
    switch(this.memory.role) {
        
        case 'remoteMiner':
            //Should work exactly like regular miner
            this.getWorkJob("miner");
        
        break;
        
        
        case 'remoteDrone':
            
            //Will eventually change this into a function to find 
            //the link closest to the remoteRoom exit
            let homeRoom = Game.rooms[this.memory.homeRoom];
            if(homeRoom.storage != undefined)
                this.workTarget = homeRoom.storage.id;
            else
                console.log(this.name + ": No storage found!");
                
        break;
        
        
        case 'remoteReserver':
            
            if(this.room.controller != undefined)
                this.workTarget = this.room.controller.id;
            else
                console.log(this.name + ": No controller found!");
                
        break;
        
        
        default:
        
            console.log(this.name + " is an invalid creep for Creep.prototype.getRemoteWorkJob");
            
        break;
        
    }
    
}
