'use strict';

//run get energy for the remote drones
Creep.prototype.runGetEnergyRemote = function(){

    var target = Game.getObjectById(this.workTarget);
	
	if(target == null || target == undefined){
	    this.getTargetRemote(RESOURCE_ENERGY);
	    target = Game.getObjectById(this.workTarget);
	    //catch if there are no available targets
	    if(target == null) return;
	    
	}
	
	//if creep is a miner, let it mine forever in this state
	if(this.role === 'remoteMiner')
	{
	    this.harvest(target);
	}
	else
	{
		if(!this.Full)
		{
			//if creep is not full, get energy
			if(target.energyAvailable() > 0)
		        this.getEnergy(target);
	        else
	            this.getRemoteTarget(RESOURCE_ENERGY);
		}
		else
		{
			//when creep is full, get a new target and set state to moving
			this.getRemoteTarget();
		}
	}

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
Creep.prototype.getTargetRemote = function (targetType){
    
    
    //this makes targetType an optional parameter.
    //if it is not defined in the function call, it will equal null
    this.workTarget = null;
    targetType = targetType || null;
    
    //If not in remoteRoom, target center of it
    if(this.room.name != this.memory.remoteRoom){
        //Places the properties of a RoomPosition target in memory instead
        this.workTarget = {x: 25, y: 25, roomName: this.memory.remoteRoom};
    }
    //check if the creep is empty or if we request an energy target
    else if(this.Empty || targetType == RESOURCE_ENERGY)
    {
        this.workTarget = this.getEnergyJob();
    }
    else //if targetType == "WORK" / this.Full
    {

        //Very basic function (Only has default targets in it)
        this.workTarget = this.getRemoteWorkJob();
        
    }
    
    this.state = 'STATE_MOVING';
}


//run clamining state
Creep.prototype.runClaiming = function(){

}
//-----------
