StructureTower.prototype.run = function() {
  
    if(this.room.memory.jobQueues.towerJobs == undefined){
        this.getJobQueue();
    }
    
    let target = this.room.memory.jobQueues.towerJobs.pop();
    target = Game.getObjectById(target);
    
    let returnString = ERR_INVALID_TARGET;
    
    if(target instanceof Structure){
        returnString = this.repair(target);
    }
    else if(target instanceof Creep){
        
        if(target.my){
            returnString = this.heal(target);
        }
        else{
            returnString =  this.attack(target);
        }
    }
    
    return returnString;
};

StructureTower.prototype.getJobQueue = function() {
    
    let lowCreeps, enemies, repairTargets;
    let targetQueue = [];
    
    lowCreeps = _.map(this.room.memory.creepsInRoom, name => Game.creeps[name]);
    lowCreeps = _.filter(lowCreeps, c => c.hits < c.hitsMax);
    
    targetQueue = targetQueue.concat(lowCreeps);
    
    if(lowCreeps == undefined){
        
        enemies = undefined; //however we find enemies here. I imagine we'll store them in a targetQueue somewhere
        //so that our defending creeps don't have to each do a room.find(FIND_HOSTILE_CREEPS);
        
        targetQueue = targetQueue.concat(enemies);
        
        if(enemies == undefined){
            
            repairTargets = _.map(Object.keys(this.room.memory.repairTargets), id => Game.getObjectById(id));
            repairTargets = _.filter(repairTargets, rt => this.room.memory.repairTargets[rt.id] <= .20, this);
            
            
            targetQueue = targetQueue.concat(repairTargets);
        }
    }
    
    if(targetQueue != undefined){
        targetQueue = _.map(targetQueue, t => t.id);
    }
    
    this.room.memory.jobQueues.towerJobs = targetQueue;
    
};
