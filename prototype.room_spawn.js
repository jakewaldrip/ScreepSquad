//handles spawning for each room

//get the next creep to spawn
Room.prototype.getNextCreepToSpawn = function () {

}
//-----


//get the next creep to spawn
Room.prototype.spawnNextCreep = function () {

}
//-----


//get the next creep to spawn
Room.prototype.getCreepSpawnEnergyCost = function () {

}
//-----


//get limit of the creeps for the room
Room.prototype.getCreepLimits = function () {

    var roomState = this.memory.roomState;

    var numMiners = 0;
    var numDrones = 0;
    var numWorkers = 0;

    switch(roomState)
    {
        //for beginner room state
        case 'ROOM_STATE_BEGINNER':

            this.memory.creepLimits["miners"] = 4;
            this.memory.creepLimits["drones"] = 4;
            this.memory.creepLimits["workers"] = 4;

            break;

        //for intermediate room state
        case 'ROOM_STATE_INTERMEDIATE':

            this.memory.creepLimits["miners"] = 2;
            this.memory.creepLimits["drones"] = 3;
            this.memory.creepLimits["workers"] = 6;

            break;

        //for advanced room state
        case 'ROOM_STATE_ADVANCED':

            this.memory.creepLimits["miners"] = 2;
            this.memory.creepLimits["drones"] = 4;
            this.memory.creepLimits["workers"] = 4;

            break;


        default:

            console.log("Invalid room_state passed to getCreepLimits");

            break;
    }
}
//------

