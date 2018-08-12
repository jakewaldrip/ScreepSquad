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

    //get work target id/object
    var target = this.memory.workTarget;
    //checks if it's an object stored in memory and if it has an "x" property.
    //Should also check for y and roomName, but this should work for us w/o wasting CPU
    if(target instanceof Object && target.hasOwnProperty("x")){
        target = new RoomPosition(target.x, target.y, target.roomName);
    }
    else{
        target = Game.getObjectById(target);
    }
    
    var targetRoom = this.memory.targetRoom;
    
    var homeRoom = this.memory.homeRoom;


    //if target exists, move to it, otherwise get one
    if(target != null && target != undefined)
    {
        //check if target is an instance of a room or a room object
        if(target instanceof RoomPosition)
        {
            if(this.room.name == targetRoom){
                this.getTargetRemote();
                //Not sure if below line will cause a loop or not
                //this.run();
            }
            else{
                
                this.moveTo(target);
            }
        }
        else
        {
            if(this.canReach(target) ){
                this.getNextStateRemote();
                //Not sure if below line will cause a loop or not
                //this.run();
            }
            else{
                this.moveTo(target);
            }
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
