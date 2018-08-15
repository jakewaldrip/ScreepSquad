'use strict';

//run get energy for the remote drones
Creep.prototype.runGetEnergyRemote = function(){

    var target = Game.getObjectById(this.workTarget);
	
	if(target == null || target == undefined){
	    this.getRemoteTarget(RESOURCE_ENERGY);
	    target = Game.getObjectById(this.workTarget);
	    //catch if there are no available targets
	    if(target == null) return;
	    
	}
	

	if(!this.Full) {
        
		//if creep is not full, get energy
		if(target.energyAvailable() > 0)
            this.getEnergy(target);
        else
            this.getRemoteTarget(RESOURCE_ENERGY);
        
	}
	else {
	    
		//when creep is full, get a new target and set state to moving
		this.getRemoteTarget();
		
	}

}
//----------


//run use energy for remote drones
Creep.prototype.runUseEnergyRemote = function(){
    
    //works ONLY for drones
    var target = Game.getObjectById(this.workTarget);
    //Assumes that their only target is storage/links
    this.transfer(target, RESOURCE_ENERGY);
    
    this.getRemoteTarget();
    this.run();
}

//---------


//run moving for remote creeps
Creep.prototype.runMovingRemote = function(){

    //get work target id/object
    var target = this.workTarget;
    
    var targetRoom = this.memory.remoteRoom;
    
    //checks if it's an object stored in memory and if it has an "x" property.
    //Should also check for y and roomName, but this should work for us w/o wasting CPU
    if(target instanceof Object && target.hasOwnProperty("x")){
        target = new RoomPosition(target.x, target.y, target.roomName);
        targetRoom = target.roomName;
    }
    else{
        target = Game.getObjectById(target);
    }
    
    var homeRoom = this.memory.homeRoom;


    //if target exists, move to it, otherwise get one
    if(target != null && target != undefined)
    {
        //check if target is an instance of a room or a room object
        if(target instanceof RoomPosition)
        {
            //avoids getting stuck on exit tile if there is no target from getRemoteTarget()
            this.moveTo(target, this.moveOpts() );
            if(this.room.name == targetRoom){
                this.getRemoteTarget();
                //Definitely causes a loop
                //this.run();
            }
            
        }
        else
        {
            if(this.canReach(target) ){
                this.getNextStateRemote();
                //Periodically causes a loop
                //this.run();
            }
            else{
                
                if(this.isOnExitTile())
			    {
			        this.moveAwayFromExit();
			    }
			    else
			    {
			        this.moveTo(target, this.moveOpts() );
			    }
            }
            
        }
    }
    else
    {
        //if target is not defined, find a new one!!
        this.getRemoteTarget();
    }
}

//---------


//run spawning for remote creeps
Creep.prototype.runSpawningRemote = function(){

    //if creep is not spawning, get it a target and change state
    if(!this.spawning)
    {
        this.getRemoteTarget();
    }
}

//----------


//run mining for static remote miners
Creep.prototype.runHarvestingRemote = function(){
    
    var target = Game.getObjectById(this.workTarget);
    
    //If we have expended the source work on container
    if(this.harvest(target) == ERR_NOT_ENOUGH_RESOURCES) {
        
        //If we have no energy in carry, pick up from our drops
        if(this.carry[RESOURCE_ENERGY] == 0){
            
            var droppedEnergy = this.pos.lookFor(LOOK_ENERGY)[0];
            if(droppedEnergy != null){
                this.pickup(droppedEnergy);
            }
            //If there are no drops, use energy from container
            else if(target.container != undefined){
                
                let container = Game.getObjectById(target.container);
                //check if container is a structure or constSite
                if(container instanceof StructureContainer)
                    this.withdraw(container, RESOURCE_ENERGY);
            }
        }
        
        //Check if source has a container assigned,
        //if it doesn't, construct one or reassign it
        if(target.container == undefined){
            
            //place a construction site and store it in memory, or check for an existing container
            this.pos.createConstructionSite(STRUCTURE_CONTAINER)
            
            //Check for construction site that exists
            let construction = this.pos.lookFor(LOOK_CONSTRUCTION_SITES)[0];
            
            if(construction != null && construction.structureType == STRUCTURE_CONTAINER){
                //assign it to target memory(room.memory.sources[source.id].container)
                target.container = construction.id;
                
            }
            //Check for a container structure
            else{
             
                let container = this.pos.lookFor(LOOK_STRUCTURES)[0];
                //assign it to target memory
                if(container != null && container.structureType == STRUCTURE_CONTAINER)
                    target.container = container.id;

            }
                    
        }
        //If one does exist, check if it needs built or repaired
        else{
            
            let container = Game.getObjectById(target.container);
            
            if(container == null)
                target.container = undefined;
            else if(container instanceof ConstructionSite)
                this.build(container);
            else if(container.hits < container.hitsMax)
                this.repair(container);
        }

        
    }
    //Drop what we have for drones to use
    else{
        
        //Not dropping energy to avoid looking for it the first building tick.
        // And also because it incurs a .2 CPU cost every tick in addition to the .2 for harvesting
        // Better to just let it drop once creep is full
        //this.drop(RESOURCE_ENERGY);
        
    }
}
//----------


//run get next state for remote creep
Creep.prototype.getNextStateRemote = function(){

    var target = Game.getObjectById(this.workTarget);
    var currentState = this.state;
	var nextState;

    

    //need to somehow check if they are either x% full before assigning use resources
     //Possible issue of going back for mroe energy before empty
    
    //could check if target is a type of energy/StructContainer and always infer that it is for getEnergy
        //Possible issue of not repairing containers(thought it might not matter if we leave miners handling that)




	if(!this.Empty || this.memory.role == "remoteMiner" || this.memory.role == "remoteReserver")
	{
		//if creep has resources, use them
		nextState = 'STATE_USE_RESOURCES';
	}
	else
	{
		//if creep has no resources, get them some
		nextState = 'STATE_GET_RESOURCES'; 
	}
	
	this.state = nextState;
	
}
//----------


//run reserving state
Creep.prototype.runReservingRemote = function(){
    
    var target = Game.getObjectById(this.workTarget);
    
    //Can optionally sign the controller here
    this.signController(target, "");
    this.reserveController(target);
}
//----------------


//run get target for creep
Creep.prototype.getRemoteTarget = function (targetType){
    
    
    //this makes targetType an optional parameter.
    //if it is not defined in the function call, it will equal null
    this.workTarget = null;
    targetType = targetType || null;
    
    //If not in remote room and not a remoteDrone OR if not in remote room and you are a drone, but you aren't full
    if(this.room.name != this.memory.remoteRoom && this.Empty ){
        //Places the properties of a RoomPosition target in memory instead
        this.workTarget = {x: 25, y: 25, roomName: this.memory.remoteRoom};
    }
    
    //check if the creep is empty or if we request an energy target
    else if( (this.Empty || targetType == RESOURCE_ENERGY) && this.memory.role != "remoteReserver" && this.memory.role != "remoteMiner")
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
    
    var target = Game.getObjectById(this.workTarget);
    
    //Can optionally sign the controller here
    //this.signController(target, "");
    this.claimController(target);
}
//-----------
