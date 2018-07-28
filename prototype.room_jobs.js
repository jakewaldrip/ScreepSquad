//Requires that room.getData() has been run.

//get job queue for creeps of each role
Room.prototype.getJobQueues = function() {
    
    this.memory.jobQueues = {};
    
    this.getMinerJobQueue();
    
    this.getDroneJobQueue();
    
    this.getWorkerJobQueue();
    
    this.getEnergyJobQueue();
    
}



//get job queue for miners
//returns [ [id, state], [], ... ]
Room.prototype.getMinerJobQueue = function () {
    
    
    
    const room = this;
    
    let sources = _.map(Object.keys(room.memory.sources), id => Game.getObjectById(id));
    
    let miners = _.filter(Game.creeps, creep => (creep.memory.role === "miner" && creep.memory.home === room.name));
    
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
                && minersTargeting.length < room.memory.sources[source.id].accessTiles.length ){ //600 is 5 work parts over 300 ticks
                
                 return true;
             
                    
            }
             else{
                 
                 return false;
                 
            }
             
        }
        
        else{
            
            return true;
            
        }
        
    });
    
    //descending by default, use .reverse() to make ascending
    targetSources = _.sortBy(targetSources, source => source.pos.getRangeTo(room.memory.structures[STRUCTURE_SPAWN][0])).reverse();
    
    
    room.memory.jobQueues.minerJobs = {};
    
    for(i = 0; i < targetSources.length; i++)
        room.memory.jobQueues.minerJobs[targetSources[i].id] = "STATE_HARVESTING";
        
}
//----


//get job queue for drones
Room.prototype.getDroneJobQueue = function () {
    let fillStructures = _.filter(this.structures, s => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity));
    
    fillStructures = removeClaimedJobs(fillStructures);
    
    let spawn = Game.getObjectById(this.memory.structures[STRUCTURE_SPAWN][0]);
    
    fillStructures = _.sortBy(fillStructures, obj => spawn.pos.getRangeTo(obj.pos), this);
    
    let formattedStructures = {};
    
    _.forEach(fillStructures, s => formattedStructures[s.id] = "STATE_USE_ENERGY");
    
    this.memory.jobQueues.droneJobs = formattedStructures;
}
//----


//get job queue for workers
//Priority: Repairs under 75% hp, construction sites, repairs over 75% hp, controller upgrading
// Returns [ [id, action], [], ... ] 
Room.prototype.getWorkerJobQueue = function () {
    
    let constSites = _.map(this.memory.constructionSites, id => Game.getObjectById(id));
    
    constSites = removeClaimedJobs(constSites);
    
    _.sortBy(constSites, cs => cs.progress / cs.progressTotal);
    
    let repairTargets = _.map(Object.keys(this.memory.repairTargets), id => Game.getObjectById(id));
    
    repairTargets = removeClaimedJobs(repairTargets);
    
    _.sortBy(repairTargets, s => this.memory.repairTargets[s.id], this).reverse();
    
    let priorityRepairTargets = _.takeWhile(repairTargets, s => this.memory.repairTargets[s.id] < .75);
    
    let formattedTargets = {};
    
    
    /* Will change to this if we don't use the REPAIR/BUILD value in worker.run().
    let targets = priorityRepairTargets.concat(constSites, repairTargets, controller);
    
    _.forEach(targets, t => formattedTargets[t.id] = "STATE_USE_ENERGY");
    */
    
    _.forEach(priorityRepairTargets, t => formattedTargets[t.id] = "REPAIR");
    _.forEach(constSites, t => formattedTargets[t.id] = "BUILD");
    _.forEach(repairTargets, t => formattedTargets[t.id] = "REPAIR");
    
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
            formattedEnergy[obj.id] = obj.resourceType;
        }
        else{
            formattedEnergy[obj.id] = obj.structureType;
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
            
        if(!_.any(Game.creeps, creep => creep.workTarget == value) )
            returnValues.push(checkValues[i]);
    }
    
    return returnValues;
}

//Use Job Queues
//--------------------------------------------------------------------------------------------//

Room.prototype.assignJobs = function() {
    
    //this.assignRoleJobs("miner");
    //this.assignRoleJobs("drone");
    
    this.assignMinerJobs();
    
    this.assignDroneJobs();
    
    this.assignWorkerJobs();
    
}
    
//Generic assignJobs, potentially useful for DRY programming
//not using it until I'm sure of how we will handle not duplicating tasks
//for drones and workers. Miners should already handle duplication in
//their jobQueue creation.
Room.prototype.assignRoleJobs = function(role){
        
    let idleCreeps = _.filter(Game.creeps, creep =>
        (creep.homeRoom == this.name && creep.role == role 
        && creep.workTarget == null));
    
    if(idleCreeps.length > 0){
        
        let jobQueue = _.pairs( this.jobQueues[role + "Jobs"] );
        
        _.forEach(idleCreeps, function(creep) {
            
            if(jobQueue.length > 0){
                
                let job = jobQueue.shift();
                
                delete this.jobQueues[role + "Jobs"][job[0]];
                
                creep.workTarget = job[0];
                //creep.state = job[1];
                
            }
        }, this);
        
    }
}
    
Room.prototype.assignMinerJobs = function() {
    //miners that need a task
    let idleMiners = _.filter(Game.creeps, creep => 
        (creep.homeRoom == this.name && creep.role == "miner" 
        && creep.workTarget == null) );
    
    if(idleMiners.length > 0){
    
        let jobQueue = _.pairs( this.jobQueues.minerJobs );
           
        _.forEach(idleMiners, function(miner) {
            
            if(jobQueue.length > 0){
                
                let job = jobQueue.shift();
                
                delete this.jobQueues.minerJobs[job[0]];
                
                miner.workTarget = job[0];
                //miner.state = job[1];
                
            }

        }, this);
    
    }
}
    
Room.prototype.assignDroneJobs = function() {
        
    let idleDrones = _.filter(Game.creeps, creep =>
        (creep.homeRoom == this.name && creep.role == "drone" 
        && creep.workTarget == null));
    
    if (idleDrones.length > 0){
        
        let jobQueue = _.pairs( this.jobQueues.droneJobs );
        
        _.forEach(idleDrones, function(drone) {
           
           if(jobQueue.length > 0){
               
               let job = jobQueue.shift();
               
               delete this.jobQueues.droneJobs[job[0]];
               
               drone.workTarget = job[0];
               //drone.state = job[1];
           } 
        }, this);
    }
}
    
Room.prototype.assignWorkerJobs = function() {
    let upgradingController = false;
    
    let workers = _.filter(Game.creeps, creep => (creep.homeRoom == this.name && creep.role == "worker"));
    
    let idleWorkers = [];
    
    _.forEach(workers, function(worker) {
       
       if(worker.workTarget == null){
           idleWorkers.push(worker);
       }
       else if(worker.workTarget == this.controller.id){
           upgradingController = true;
       }
        
    }, this);
    
    if(idleWorkers.length > 0){
        
        let jobQueue = _.pairs( this.jobQueues.workerJobs );
        
        _.forEach(idleWorkers, function(worker) {
           
           let job;
           
           if(upgradingController == false || jobQueue.length == 0){
               job = [];
               job[0] = this.controller.id;
               job[1] = "UPGRADE";
               upgradingController = true;
            }
            else{
                
                job = jobQueue.shift();
                
                delete this.jobQueues.workerJobs[job[0]];
            }
            
            worker.workTarget = job[0];
            //worker.state = "STATE_USE_ENERGY";
            
        }, this);
        
    }
    
}







