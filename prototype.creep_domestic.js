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


	if(target != null)
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
    

}
//--------


//works the creep's target and switches to proper state upon using up all energy or finishing the job
Creep.prototype.runWorkDomestic = function () {


}
//---------


//switches the creep to the next state
Creep.prototype.getNextStateDomestic = function () {

    var target = Game.getObjectById(this.workTarget);
    var currentState = this.state;
	var nextState;

	//if creep is a miner only give access to get resources
	if(this.role === 'miner')
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
