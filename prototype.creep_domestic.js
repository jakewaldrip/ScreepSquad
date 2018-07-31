'use strict';


//checks if the creep has a target and switches state based on target
Creep.prototype.runSpawningDomestic = function () {
    
    //check if the creep done spawning, get the next state
    if(!this.spawning){
        this.getTarget();
        this.state = 'STATE_MOVING';
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
			if(this.pos.isNearTo(target))
			{
				//get next state 
				this.getNextStateDomestic();
			}
			else
			{
				//move to target
			    this.moveTo(target, {reusePath: 10});
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
	if(target == null){
	    this.getTarget();
	    this.state = 'STATE_MOVING';
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
		    this.getEnergy(target);
		}
		else
		{
			//when creep is full, get a new target and set state to moving
			this.getTarget();
			this.state = 'STATE_MOVING';
		}
	}
}
//--------


//works the creep's target and switches to proper state upon using up all energy or finishing the job
Creep.prototype.runWorkDomestic = function () {
	
	//as long as the creep has energy, keep using it
	if(!this.Empty)
	{
		var target = this.workTarget;

		//fail safe if job is complete before creep uses up energy
		if(target == null)
		{
			this.getTarget();
			target = Game.getObjectById(this.workTarget);
		}

		//try to do work, catch invalid target (sometimes takes a couple ticks to catch up with a null target)
		//this keeps script from breaking in the mean time
		try
		{
			//if the target is a valid target for a creep to use energy on
			if(target.energy < target.energyCapacity || target == this.room.controller 
			|| target.progress !== undefined || target.hits !== undefined)
			{
				//do work on the target
			    this.useEnergy(target);
			}
			else
			{
				//if the target is full, gone, undefined, whatever, find new target and go back to moving 
				//(run role again so the creep doesn't have to wait another tick to go)
				this.getTarget();
				this.state = 'STATE_MOVING'
				this.run();
			}
		}
		catch(err)
		{
			//do nothing lol
		}

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
Creep.prototype.getTarget = function () {
    
    //check if the creep is empty to decide which target to get
    if(this.Empty && this.role != "miner")
    {
        //if creep has no energy, get an energy job
        this.workTarget = this.room.getEnergyJob();
    }
    else
    {
        //if creep has energy, get a work job
        this.workTarget = this.room.getWorkJob(this.role);
    }
}
