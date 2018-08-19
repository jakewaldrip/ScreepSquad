/** @namespace Creep */
Creep.prototype.run = function() {
    
    let role = {
        
        drone: require('role.Drone'),
        
        miner: require('role.Miner'),
        
        worker: require('role.Worker'),
        
        remoteDrone: require('role.RemoteDrone'),
        
        remoteMiner: require('role.RemoteMiner'),
        
        remoteReserver: require('role.RemoteReserver'),
        
        remoteDefender: require('role.RemoteDefender')
        
    };
    
    try{
    if(role[this.role])
        role[this.role].run(this);
    }
    catch(err){
        
        console.log(`The creep <font color="efdc0e">${this.name}</font> has encountered an issue.`);
        console.log(`<font color="#e04e4e">       ${err.stack} </font>`);
    }
    
}

Creep.prototype.useEnergy = function(targetObj) {
    
    if(targetObj instanceof String){
        targetObj = Game.getObjectById(targetObj);
    }
    
    if(targetObj instanceof StructureSpawn || targetObj instanceof StructureExtension 
        || targetObj instanceof StructureStorage || targetObj instanceof StructureTower){
        return this.transfer(targetObj, RESOURCE_ENERGY);
    }
    if(targetObj instanceof ConstructionSite){
        return this.build(targetObj);
    }
    else if(targetObj instanceof StructureController){
        return this.upgradeController(targetObj);
    }
    else if(targetObj instanceof Structure){
        return this.repair(targetObj);
    }
    else{
        return ERR_INVALID_TARGET;
    }
}

Creep.prototype.getEnergy = function(targetObj){
        
    if(targetObj instanceof String){
        targetObj = Game.getObjectById(targetObj);
    }
    
    if(targetObj instanceof Energy || targetObj instanceof Mineral){
        return this.pickup(targetObj);
    }
    else if(targetObj instanceof Structure){
        return this.withdraw(targetObj, RESOURCE_ENERGY);
    }
    else{
        return ERR_INVALID_TARGET;
    }
}

Object.defineProperty(Creep.prototype, 'hasWork', {
    get: function() { return ( this.getActiveBodyparts(WORK) > 0 ); } 
});

Object.defineProperty(Creep.prototype, 'Full', {
    get: function(){ return (_.sum(this.carry) == this.carryCapacity); }
});

Object.defineProperty(Creep.prototype, 'Empty', {
    get: function(){ return (_.sum(this.carry) == 0); }
});

Object.defineProperty(Creep.prototype, 'role', {
    
    get: function() {
        if(!this.memory.role){
            return undefined;
        } 
        else{
            return this.memory.role;
        }
    },
    set: function(value) {
        
        this.memory.role = value;
    }
    
});

Object.defineProperty(Creep.prototype, 'homeRoom', {
    
    get: function() {
        if(!this.memory.homeRoom){
            return undefined;
        }
        else{
            return this.memory.homeRoom;
        }
    },
    set: function(value) {
        
        this.memory.homeRoom = value;
    }
    
});

Object.defineProperty(Creep.prototype, 'workTarget', {
    
    get: function() {
        if(!this.memory.workTarget){
            return undefined;
        }
        else{
            return this.memory.workTarget;
        }
    },
    set: function(value) {
        
        this.memory.workTarget = value;
    }
    
});

Object.defineProperty(Creep.prototype, 'state', {
    
    get: function() {
        if(!this.memory.state){
            return undefined;
        }
        else{
            return this.memory.state;
        }
    },
    set: function(value) {
        
        this.memory.state = value;
    }
    
});

Object.defineProperty(Creep.prototype, 'isAlly', {

    get: function () {
        return (this.owner == "jakesboy2" || this.owner == "UhmBrock")
    }
});


//check if creep is on an exit tile, return true if they are, false if not
Creep.prototype.isOnExitTile = function ()
{
    let x = this.pos.x;
    let y = this.pos.y;

    //if creep is on exit tile return true
    if(x === 0 || y === 0 || x === 49 || y === 49)
    {
        return true;
    }
    else
    {
        //creep is not on exit tile so return false
        return false;
    }
}


//move the creep away from the exit tile
Creep.prototype.moveAwayFromExit = function () {
    
    let x = this.pos.x;
    let y = this.pos.y;

    if(x === 0)
    {
        this.move(RIGHT);
    }
    else if(y === 0)
    {
        this.move(BOTTOM);
    }
    else if(x === 49)
    {
        this.move(LEFT);
    }
    else if(y === 49)
    {
        this.move(TOP);
    }
    else
    {
        console.log("Creep exit tile fix system failure! Red alert!");
    }
}

Creep.prototype.canReach = function(target) {
    //default for everything else
    let range = 1;
    
    if(target instanceof ConstructionSite){
        range = 3;
    }
    else if(target instanceof StructureController){
        //upgrading can be done 3 tiles away
        if(target.my){
            range = 3;
        }
        //reserving/claiming can be done 1 tile away
        else{
            range = 1;
        }
    }
    else if(target instanceof Structure){
        //transfer/withdraw (does make them approach containers to repair unfortunately)
        if(target.energy != undefined || target.store != undefined){
            range = 1;
        }
        //repairing
        else{
            range = 3;
        }
        
    }
    
    return this.pos.inRangeTo(target, range);
}

//move the miner to the container next to its source, get next state and run the creep once it arrives
Creep.prototype.moveCreepToContainer = function ()
{
    //Get target(likely a source)
    let target = Game.getObjectById(this.memory.workTarget);
    let closestContainer;
    
    //If target is a source and source has a container property assigned, use that property
    if(target instanceof Source && target.container != undefined){
        
        closestContainer = Game.getObjectById(target.container);
        
        //if source's container is invalid, reset source memory
        if(closestContainer == null)
            target.container = undefined;
            
    }
    
    //if target container doesn't exist or creep is on the container, getNextState and run again.
    if(closestContainer == null || this.pos.isEqualTo(closestContainer.pos))
    {
        
        if(this.memory.role == "miner"){
            this.getNextStateDomestic();
        }
        else if(this.memory.role == "remoteMiner"){
            this.getNextStateRemote();
        }
        this.run();
        
    }
    //container exists and creep is not on it
    else
    {
        //whether we have tried to move already
        let attemptedMove = false;
        //whether we are on the container
        let creepOnContainer = false;
        
        //if creep has a path in memory and its destination is the container, show that we have tried to move to container before
        if(this.memory._move && this.memory._move.dest)
            if(this.memory._move.dest.x == closestContainer.pos.x && this.memory._move.dest.y && closestContainer.pos.y)
                attemptedMove = true;
        
        //If we have tried to move before, look for creeps on containerPos.
        if(attemptedMove){
            creepOnContainer = _.size(closestContainer.pos.lookFor(LOOK_CREEPS)) > 0;
        }
        
        //If this is our first try, or if there is no creep on container, attempt to move to it.
        if(!creepOnContainer || !attemptedMove){
            //move to the specified container
            this.moveTo(closestContainer, this.moveOpts() );
        }
        //If container is occupied get next state and run again
        else{
            
            if(this.memory.role == "miner"){
                this.getNextStateDomestic();
            }
            else if(this.memory.role == "remoteMiner"){
                this.getNextStateRemote();
            }
            this.run();
        }
    }
}

//returns the object containing the creep's move options
Creep.prototype.moveOpts = function () {
    //Amount of ticks to reuse path
    var reuseAmount = 10;
    //Maximum CPU to use on pathing where .001 CPU = 1 op. (Screeps default is 2000).
    var maxOpts = 2000;
    
    switch(this.memory.role){
        
        case 'miner':
            return { reusePath: reuseAmount * 1.5, maxOps: maxOpts, ignoreCreeps: false, range: 1 }; break;
        
        case 'drone':
            return { reusePath: reuseAmount, maxOps: maxOpts, ignoreCreeps: false, range: 1 }; break;
        
        case 'worker':
            return { reusePath: reuseAmount, maxOps: maxOpts, ignoreCreeps: false, range: 1 }; break;
        
        case 'remoteDrone':
            return { reusePath: reuseAmount * 2, maxOps: maxOpts, ignoreCreeps: false, ignoreRoads: true, range: 1 }; break;
        
        case 'remoteMiner':
            return { reusePath: reuseAmount * 2, maxOps: maxOpts, ignoreCreeps: false, ignoreRoads: true, range: 1 }; break;
        
        case 'remoteReserver':
            return { reusePath: reuseAmount * 2, maxOps: maxOpts, ignoreCreeps: false, range: 1, ignoreRoads: true, swampCost: 2}; break; 
        
        case 'claimer':
            return { reusePath: reuseAmount * 2, maxOps: maxOpts, ignoreCreeps: false, range: 1, ignoreRoads: true, swampCost: 1}; break;
        
        case 'remoteDefender':
            return { reusePath: 5, maxOps: maxOpts, ignoreCreeps: false, range: 1, ignoreRoads: false}; break;
            
        default:
            console.log(`<font color="efdc0e">${this.name}</font> does not have a valid moveOpts object defined.`);
        
    }
    
    
}