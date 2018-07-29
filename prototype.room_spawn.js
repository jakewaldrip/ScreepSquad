//handles spawning for each room

//get the next creep to spawn
//Will spawn one of each creep type with a limit > 0
//and then max out each spawn in order of rolePriority.
Room.prototype.getNextCreepToSpawn = function () {

    this.getCreepLimits();
    
    //Ascending Priority - Miner -> Drone -> Worker
    //Important for the proper queueing of creeps.
    const rolePriority = [
        "worker",
        "drone",
        "miner"
    ];
    
    let nextCreep, counts = {};
    //could check here if creeps count >= rolePriority.count to save CPU in later stages
    //or just check this if roomState == BEGINNER
    _.forEach(rolePriority, function(role) {
        
        counts[role] = this.getCreepSum(role);
        
        if(counts[role] === 0 && counts[role] < this.memory.creepLimits[role])
            nextCreep = role;
            
    }, this);
    
    if(nextCreep == null){
        
        _.forEach(rolePriority, function(role) {
            
           if(counts[role] < this.memory.creepLimits[role]){
               nextCreep = role;
           }
            
        }, this);
        
    }
    
    return nextCreep;
}
//-----


//This function runs getNextCreepToSpawn, getCreepSpawnEnergyCost, and then passes
//the params to spawner.createRole, assuming there is an available spawn.
Room.prototype.spawnNextCreep = function () {
    
    let emptySpawner = _.find(this.memory.structures[STRUCTURE_SPAWN], spawn => spawn.spawning == null);
    
    if(emptySpawner){
        
        let role = this.getNextCreepToSpawn();
        
        if(role != undefined){
            
            let energyCost = this.getCreepSpawnEnergyCost(role);
            
            if(this.energyAvailable >= energyCost){
                
                emptySpawner = Game.getObjectById(emptySpawner);
                
                emptySpawner.createRole(this.name, energyCost, role);
                    
            }
        }
    }
}
//-----


//get the next creep to spawn
Room.prototype.getCreepSpawnEnergyCost = function (role) {
    
    //For testing only
    return 300;
    
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
            
            let numOfSources = Object.keys(this.memory.sources).length;
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
            
            numMiners = this.memory.sources.length + this.memory.structures[STRUCTURE_EXTRACTOR].length;
            numDrones = 4;
            numWorkers = 4 + (this.memory.remoteRooms.length * 2);

            break;


        default:

            console.log("Invalid room_state passed to getCreepLimits");

            break;
    }
    this.memory.creepLimits = {};
    //commit values to memory from here
    this.memory.creepLimits["miner"] = numMiners;
    this.memory.creepLimits["drone"] = numDrones;
    this.memory.creepLimits["worker"] = numWorkers;
}
//------


//passes creep role and returns the number of existing creeps in the room of this role
Room.prototype.getCreepSum = function (role) {

    var creepsInRoom = _.filter(Game.creeps, c => c.memory.homeRoom == this.name);
    var numOfRole = _.sum(creepsInRoom, c => c.memory.role === role);

    return numOfRole;
}

