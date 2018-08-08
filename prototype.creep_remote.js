'use strict';

//run get energy for the remote drones
Creep.prototype.runGetEnergyRemote = function(){

}
//----------


//run use energy for remote drones
Creep.prototype.runUseEnergyRemote = function(){

}

//---------


//run moving for remote creeps
Creep.prototype.runMovingRemote = function(){

    //get work target object
    var target = Game.getObjectById(this.workTarget);


    if(target != null && target != undefined)
    {
        //check if the target is an instance of another room
        //if so, move to that room
        //if not, move to the correct object:w
    }
    else
    {
        //if target is null, find a new one!!
        this.getTargetRemote();
    }
}

//---------


//run spawning for remote creeps
Creep.prototype.runSpawningRemote = function(){

    //if creep is not spawning, get it a target and change state
    if(!this.spawning)
    {
        this.getTargetRemote();
    }
}

//----------


//run mining for static remote miners
Creep.prototype.runHarvestingRemote = function(){

}
//----------


//run get next state for remote creep
Creep.prototype.getNextStateRemote = function(){

}
//----------


//run reserving state
Creep.prototype.runReserving = function(){
    
}
//----------------


//run get target for creep
Creep.prototype.getTargetRemote = function (){
    
}

//run clamining state
Creep.prototype.runClaiming = function(){

}
//-----------
