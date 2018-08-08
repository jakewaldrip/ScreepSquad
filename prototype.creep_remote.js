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
    var targetRoom = this.memory.targetRoom;
    var homeRoom = this.memory.homeRoom;


    //if target exists, move to it, otherwise get one
    if(target != null && target != undefined)
    {
        //check if target is an instance of a room or a room object
        if(target instanceof RoomPosition)
        {
            //check if creep is in the proper room
            //if not move to it
            //if so, get a new target and run creep
        }
        else
        {
            //check if creep is in range of target
            //if not move to it
            //if so, get next state
        }
    }
    else
    {
        //if target is not defined, find a new one!!
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
