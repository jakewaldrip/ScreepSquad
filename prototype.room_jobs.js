//Requires that room.getData() has been run.

//get job queue for miners
//returns [ [id, state], [], ... ]
Room.prototype.getMinerJobQueue = function () {
    
    
    let sources = _.map(Object.keys(this.memory.sources), id => Game.getObjectById(id));
    
    let miners = _.filter(Game.creeps, creep => (creep.memory.role === "miner" && creep.memory.homeRoom === this.name), this);
    
    let targetSources = _.filter(sources, function(source) {
        
        let minersTargeting = _.remove(miners, miner => miner.memory.workTarget === source.id);
        
        if(minersTargeting.length > 0){
            /*
             *let minMiner = _.min(minersTargeting, creep => creep.ticksToLive);
             *if (minMiner.ticksToLive <= #Distance to source in ticks#){
             *  minersTargeting.remove(minMiner);
             *}
             */
             
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
    
    //descending by default, use .reverse() to make ascending
    targetSources = _.sortBy(targetSources, source => source.pos.getRangeTo(this.memory.structures[STRUCTURE_SPAWN][0])).reverse();
    
    this.memory.jobQueues.minerJobs = {};
    
    for(i = 0; i < targetSources.length; i++)
        this.memory.jobQueues.minerJobs[targetSources[i].id] = "STATE_HARVESTING";
        
}
//----


//get job queue for drones
Room.prototype.getDroneJobQueue = function () {
    let fillStructures = _.filter(this.structures, s => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity));
    
    fillStructures = removeClaimedJobs(fillStructures);
    
    let spawn = Game.getObjectById(this.memory.structures[STRUCTURE_SPAWN][0]);
    
    fillStructures = _.sortBy(fillStructures, obj => spawn.pos.getRangeTo(obj.pos), this);
    
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
    //Primary sort by structureType (a-z) and then by progress ( 99.9 -> 0.0 )
    constSites = _.sortByAll(constSites, cs => [cs.structureType, 
                            (cs.progress / cs.progressTotal) - 1]);
    
    
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
    
    let formattedTargets = {};
    _.forEach(targets, function(t) {
       if(t instanceof ConstructionSite){
           formattedTargets[t.id] = t.progressTotal - t.progress;
       } 
       else{
           formattedTargets[t.id] = "STATE_USE_RESOURCES";
       }
    });
    
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
        
    },
    function(obj){
        //secondary sort by distance to spawn
        let spawn = Game.getObjectById(this.memory.structures[STRUCTURE_SPAWN][0]);
        return obj.pos.getRangeTo(spawn.pos)
        
    });
    
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
    
    //get array into descending order
    sortedArray.reverse();
    
    let formattedEnergy = {};
    
    _.forEach(sortedArray, function(obj) {
        if(obj instanceof Energy){
            formattedEnergy[obj.id] = obj.amount;
        }
        else{
            formattedEnergy[obj.id] = _.sum(obj.store[RESOURCE_ENERGY]);
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
    
Room.prototype.getEnergyJob = function() {
    
    if(!this.memory.jobQueues["getEnergyJobs"]){
        this.getEnergyJobQueue();
    }
    
    let jobQueue = _.pairs( this.jobQueues["getEnergyJobs"] );
    
    let job = [null, null];
    
    if(jobQueue.length > 0){
        
        job = jobQueue.shift();
        
        let value = parseInt(job[1], 10);
        if(!isNaN(value))
            this.memory.jobQueues["getEnergyJobs"][job[0]] -= 500;
        
        if(isNaN(value) || (value - 500 <= 0) )
            delete this.jobQueues["getEnergyJobs"][job[0]];
        
    }
    
    return job[0];
}

Creep.prototype.getEnergyJob = function() {
    
    if(!this.room.memory.jobQueues["getEnergyJobs"]){
        this.room.getEnergyJobQueue();
    }
    
    var jobQueue = this.room.memory.jobQueues["getEnergyJobs"];
    
    //get the objects of the jobQueue
    var objects = Object.keys(jobQueue).getObjects();
    
    //Loop through each object and get the minimum distance object
        var closest = null, minRange = Infinity;
    
        objects.forEach( (i) => {
            
            var range = this.pos.getRangeTo(i);
            
            if(range < minRange) {
                minRange = range;
                closest = i;
            }
            
        });
    

    var job = closest;
    
    //if the job has a numeric value assigned to it
    //subtract the creeps carryCap from it, if not (or if it goes below 0)
    //remove it from the jobQueue.
    var value = parseInt(jobQueue[job.id], 10);
    
    if(!isNaN(value))
        jobQueue[job.id] -= this.carryCapacity;
        
    if(isNaN(value) || (value - this.carryCapacity <= 0) )
        delete jobQueue[job.id];
        
    return job.id;
    
}


