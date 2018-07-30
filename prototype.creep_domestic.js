'use strict';
//checks if the creep has a target and switches state based on target
Creep.prototype.runSpawningDomestic = function () {
    
    if(!this.spawning && this.workTarget != null){
        this.getNextStateDomestic();
    }
    
}
//moves the creep to the target and switches to the proper state upon arrival
Creep.prototype.runMovingDomestic = function () {

    let target = Game.getObjectById(this.workTarget);
    
    if(!this.pos.isNearTo(target)){
        this.moveTo(target, { reusePath: 10 }); //double path use for CPU conservation
    }
    else{
        this.getNextStateDomestic();
    }
}
//--------


//gets energy for the creep and switches to proper state upon becoming full
Creep.prototype.runHarvestingDomestic = function () {
    let target = Game.getObjectById(this.workTarget);
    let result = this.harvest(target);
    
    if(result == 0){
        //maintain container here if this.Full
    }
    else if(result == ERR_INVALID_TARGET){
        this.workTarget = null;
        this.state = "STATE_SPAWNING";
    }
}
//--------


//works the creep's target and switches to proper state upon using up all energy or finishing the job
Creep.prototype.runWorkDomestic = function () {

    if(!this.Empty){
        let target = Game.getObjectById(this.worktarget);
        
        this.useEnergy(target);
        
    }
}
//---------

Creep.prototype.runGatherDomestic = function () {
    
}

//switches the creep to the next state
Creep.prototype.getNextStateDomestic = function () {
    let target = Game.getObjectById(this.workTarget);
    
    if(this.pos.isNearTo(target)){
        
        if(target instanceof Energy || !this.Full){
            
        }
        //set state USE/GET_RESOURCES
        
    }
    
    else{
        this.state = "STATE_MOVING";
    }
}
//---------
