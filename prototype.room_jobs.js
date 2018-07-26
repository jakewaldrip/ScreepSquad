//get job queue for creeps of each role
Room.prototype.getJobQueues = function() {
    
    
    
    this.memory.jobQueues = {};
    
    this.getMinerJobQueue();
    
    
    
}



//get job queue for miners
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

}
//----


//get job queue for workers
Room.prototype.getWorkerJobQueue = function () {

}
//----


