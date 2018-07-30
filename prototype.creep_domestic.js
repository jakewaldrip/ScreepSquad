'use strict';


//checks if the creep has a target and switches state based on target
Creep.prototype.runSpawningDomestic = function () {
    
    //check if the creep done spawning, get the next state
    if(!this.spawning){
        this.getTarget();
        this.getNextStateDomestic();
    }
    
}
//------


//moves the creep to the target and switches to the proper state upon arrival
Creep.prototype.runMovingDomestic = function () {
    
    //get work target object
    var target = Game.getObjectById(this.workTarget);

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
//--------


//gets energy for the creep and switches to proper state upon becoming full
Creep.prototype.runHarvestingDomestic = function () {
    

}
//--------


//works the creep's target and switches to proper state upon using up all energy or finishing the job
Creep.prototype.runWorkDomestic = function () {


}
//---------


//i have no idea what this is supposed to do im hoping brock tells me lol
Creep.prototype.runGatherDomestic = function () {
    

}
//------


//switches the creep to the next state
Creep.prototype.getNextStateDomestic = function () {
    let target = Game.getObjectById(this.workTarget);
    
    switch(this.state){
        case "STATE_SPAWNING":
            if(this.workTarget != null){
                this.state = "STATE_MOVING";
            }
        break;
        
        case "STATE_MOVING":
            
            if(target instanceof Source)
                this.state = "STATE_HARVESTING";
            else if(target instanceof Structure && this.Empty)
                this.state = "STATE_GET_RESOURCES";
            else
                this.state = "STATE_USE_RESOURCES";
            
            
        break;
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
