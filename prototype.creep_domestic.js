'use strict';


//checks if the creep has a target and switches state based on target
Creep.prototype.runSpawningDomestic = function () {
    
    //check if the creep done spawning, get the next state
    if(!this.spawning){
        this.getTarget();
    }
    
}
//------


//moves the creep to the target and switches to the proper state upon arrival
Creep.prototype.runMovingDomestic = function () {
    
    //get work target object
    var target = Game.getObjectById(this.workTarget);


	if(target != null && target != undefined)
	{
		//check if creep is in the correct room
		if(this.homeRoom != this.room.name)
		{
			target = new RoomPosition(25, 25, homeRoom);
		}
		else
		{
			//creep is in the correct room check if we're at the target
			if(this.canReach(target))
			{
				//get next state 
				this.getNextStateDomestic();
			}
			else
			{
				//move to target
			    //check if creep is on an exit tile, if so move off of it in the correct direction
			    if(this.isOnExitTile())
			    {
			        this.moveAwayFromExit();
			    }
			    else
			    {
			        this.moveTo(target, { reusePath: 10 });
			    }
			    
			}
		}
	}
	else
	{
		//if target is null, find a new one!!
		this.getTarget();
	}
    
}
//--------


//gets energy for the creep and switches to proper state upon becoming full
Creep.prototype.runHarvestingDomestic = function () {
    
	var target = Game.getObjectById(this.workTarget);
	
	if(target == null || target == undefined){
	    this.getTarget(RESOURCE_ENERGY);
	    target = Game.getObjectById(this.workTarget);
	    //catch if there are no available targets
	    if(target == null) return;
	    
	}
	
	//if creep is a miner, let it mine forever in this state
	if(this.role === 'miner')
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
	            this.getTarget(RESOURCE_ENERGY);
		}
		else
		{
			//when creep is full, get a new target and set state to moving
			this.getTarget();
		}
	}
}
//--------


//works the creep's target and switches to proper state upon using up all energy or finishing the job
Creep.prototype.runWorkDomestic = function () {
	
	//as long as the creep has energy, keep using it
	if(!this.Empty)
	{
		var target = Game.getObjectById(this.workTarget);

		//fail safe if job is complete before creep uses up energy
		if(target == null)
		{
			this.getTarget();
			target = Game.getObjectById(this.workTarget);
			
			if(target == null)
			    return;
		}

		//try to do work, catch invalid target (sometimes takes a couple ticks to catch up with a null target)
		//this keeps script from breaking in the mean time
		try
		{
			//if the target is a valid target for a creep to use energy on
			if(target.energy < target.energyCapacity || target == this.room.controller 
			|| target.progress < target.progressTotal || target.hits < target.hitsMax)
			{
				//do work on the target
			    this.useEnergy(target);
			}
			else
			{
				//if the target is full, gone, undefined, whatever, find new target and go back to moving 
				//(run role again so the creep doesn't have to wait another tick to go)
				this.getTarget();
				this.run();
			}
		}
		catch(err)
		{
			console.log(this.name + " has encountered an issue in runWorkDomestic");
			console.log('<font color="#e04e4e">       ' + err.stack + "</font>");
		}

	}
	//If Creep is empty reselect target 
	else{
	    this.getTarget();
	    this.run();
	}
}
//---------


//switches the creep to the next state
Creep.prototype.getNextStateDomestic = function () {

    var target = Game.getObjectById(this.workTarget);
    var currentState = this.state;
	var nextState;

	//if creep is a miner only give access to get resources
	if(this.role === 'miner' || target instanceof Source)
	{
		nextState = 'STATE_GET_RESOURCES';
	}
	else if(!this.Empty)
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
//---------


//decides if the creep should get an energy target or a work target
Creep.prototype.getTarget = function (targetType) {
    
    //this makes targetType an optional parameter.
    //if it is not defined in the function call, it will equal null
    this.workTarget = null;
    targetType = targetType || null;
    
    //check if the creep is empty to decide which target to get
    if((this.Empty && this.role != "miner") || targetType == RESOURCE_ENERGY)
    {
        //if creep has no energy, get an energy job
        this.workTarget = this.getEnergyJob();
    }
    else //if targetType == "WORK"
    {

        //supports drone, miner and worker 
        this.workTarget = this.getWorkJob();
        
        //Generic getWorkJob
        //this.workTarget = this.room.getWorkJob(this.role);
    }
    
    this.state = 'STATE_MOVING';
}
