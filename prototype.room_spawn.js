//handles spawning for each room

//get the next creep to spawn
Room.prototype.getNextCreepToSpawn = function () {

<<<<<<< HEAD
    this.getCreepLimits();
    
    //Descending Priority - Miner -> Drone -> Worker
    const rolePriority = [
        "miner",
        "drone",
        "worker"
    ];
    
    //go through each priorityRole and check if it has less than creepLimit
    // but also has to have at least one of each

//All code below here is temporary. Will follow ^ logic after tonight.
    //get number of all the creeps in the room
    var numMiners = this.getCreepSum('miner');
    var numDrones = this.getCreepSum('drone');
    var numWorkers = this.getCreepSum('worker');

    //get creep limits of all creeps in the room
    var minerLimit = this.memory.creepLimits["miners"];
    var droneLimit = this.memory.creepLimits["drones"];
    var workerLimit = this.memory.creepLimits["workers"];

    //get the next creep in the correct order based on the amount of creeps needed and creeps currently there
    if(numMiners < minerLimit)
    {
        return 'miner';
    }
    else if(numDrones < droneLimit)
    {
        return 'drone';
    }
    else if(numWorkers < workerLimit)
    {
        return 'worker';
    }
}
//-----


//get the next creep to spawn
Room.prototype.spawnNextCreep = function () {

}
//-----


//get the next creep to spawn
Room.prototype.getCreepSpawnEnergyCost = function (role) {

}
//-----


//get limit of the creeps for the room
//NEEDS UPDATED TO BE DYNAMIC
Room.prototype.getCreepLimits = function () {

    var roomState = this.memory.roomState;

    var numMiners = 0;
    var numDrones = 0;
    var numWorkers = 0;

    switch(roomState)
    {
        //for beginner room state
        case 'ROOM_STATE_BEGINNER':
            
            let numOfSources = this.memory.sources.length;
            let workPerCreep = 2 * Math.floor(this.energyCapacityAvailable / (BODYPART_COST["work"] * 2 + BODYPART_COST["move"] * 1));

            numMiners = Math.ceil(5 / workPerCreep) * numOfSources;
            numDrones = 4;
            numWorkers = 5;
           
            break;

        //for intermediate room state
        case 'ROOM_STATE_INTERMEDIATE':

            numMiners = this.memory.sources.length;
            numDrones = 3;
            numWorkers = 4 + (this.memory.remoteRooms.length * 2);

            break;

        //for advanced room state
        case 'ROOM_STATE_ADVANCED':
            
            numMiners = this.memory.sources.length;
            numDrones = 4;
            numWorkers = 4 + (this.memory.remoteRooms.length * 2);

            break;


        default:

            console.log("Invalid room_state passed to getCreepLimits");

            break;
    }

    //commit values to memory from here
    this.memory.creepLimits["miners"] = numMiners;
    this.memory.creepLimits["drones"] = numDrones;
    this.memory.creepLimits["workers"] = numWorkers;
}
//------


//passes creep role and returns the number of existing creeps in the room of this role
Room.prototype.getCreepSum = function (role) {

    var creepsInRoom = this.memory.creepsInRoom;
    var numOfRole = _.sum(creepsInRoom, c => c.memory.role === role);

    return numOfRole;
}

