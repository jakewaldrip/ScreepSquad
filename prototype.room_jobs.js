//Requires that room.getData() has been run.

//get job queue for creeps of each role
Room.prototype.getJobQueues = function() {
    
    this.memory.jobQueues = {};
    
    this.getMinerJobQueue();
    
    this.getHarvesterJobQueue();
    
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


//get job queue for harvesters
Room.prototype.getHarvesterJobQueue = function () {
    let fillStructures = _.filter(this.structures, s => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity));
    
    let spawn = Game.getObjectById(this.memory.structures[STRUCTURE_SPAWN][0]);
    
    fillStructures = _.sortBy(fillStructures, obj => spawn.pos.getRangeTo(obj.pos), this);
    
    let formattedStructures = {};
    
    _.forEach(fillStructures, s => formattedStructures[s.id] = "STATE_USE_ENERGY");
    
    this.memory.jobQueues.harvesterJobs = formattedStructures;
}
//----


//get job queue for workers
//Priority: Repairs under 75% hp, construction sites, repairs over 75% hp, controller upgrading
// Returns [ [id, action], [], ... ] 
Room.prototype.getWorkerJobQueue = function () {
    
    let constSites = _.map(this.memory.constructionSites, id => Game.getObjectById(id));
    
    _.sortBy(constSites, cs => cs.progress / cs.progressTotal);
    
    let repairTargets = _.map(Object.keys(this.memory.repairTargets), id => Game.getObjectById(id));
    
    _.sortBy(repairTargets, s => this.memory.repairTargets[s.id], this);
    
    let priorityRepairTargets = _.takeRightWhile(repairTargets, s => this.memory.repairTargets[s.id] < .75);
    
    let controller = this.controller;
    
    let formattedTargets = {};
    
    //Not sure which you prefer, commented out one just sets each id = "STATE_USE_ENERGY"
    // Uncommented one sets each target to the action you perform on it.
    /*
    let targets = priorityRepairTargets.concat(constSites, repairTargets, controller);
    
    _.forEach(targets, t => formattedTargets[t.id] = "STATE_USE_ENERGY");
    */
    
    formattedTargets[controller.id] = "UPGRADE";
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









