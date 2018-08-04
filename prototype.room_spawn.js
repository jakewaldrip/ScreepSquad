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
        {
            nextCreep = role;
        }

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


//get the energy cost of the next creep
Room.prototype.getCreepSpawnEnergyCost = function (role) {
    
    var roomState = this.memory.roomState;
    var energyCapacity = this.energyCapacityAvailable;
    var energyCost;
    
    //roomState Beginner
    var roleMaxCost = {
        miner: 700,
        drone: 1200,
        worker: 1700
    }
    
    if(roomState == "STATE_INTERMEDIATE"){
        roleMaxCost = {
            miner: 700,
            drone: 1200,
            worker: 1700
        }
    }
    
    if(roleMaxCost[role] && energyCapacity >= roleMaxCost[role]){
        energyCost = roleMaxCost[role];
    }
    else{
        energyCost = energyCapacity;
    }
    
    return energyCost;
}
//-----


//get limit of the creeps for the room
//NEEDS UPDATED TO BE DYNAMIC
Room.prototype.getCreepLimits = function () {

    var roomState = this.memory.roomState;

    var numMiners = 0;
    var numDrones = 0;
    var numWorkers = 0;
    
    var energyCap = this.energyCapacityAvailable;


    let numRemoteRooms = Object.keys(this.memory.remoteRooms).length;
    let numOfSources = Object.keys(this.memory.sources).length;
    
    switch(roomState)
    {
        //for beginner room state
        case 'ROOM_STATE_BEGINNER':
            
            let workPerCreep = 2 * Math.floor(this.energyCapacityAvailable / (BODYPART_COST["work"] * 2 + BODYPART_COST["move"] * 1));
            let accessTiles = _.sum(this.memory.sources, source => source.accessTiles.length);
            //get number of miners needed to saturate the sources
            numMiners = Math.ceil(5 / workPerCreep) * numOfSources;
            if(numMiners >= accessTiles)
                numMiners = accessTiles;

            //change creep limits based on available energy
            if (energyCap < 550)
            {
                numDrones = 4;
                numWorkers = 4;
            }
            else
            {
                numDrones = 3;
                numWorkers = 5;
            }
            
           
            break;

        //for intermediate room state
        case 'ROOM_STATE_INTERMEDIATE':

            //1 miner per source at this point will saturate the sources
            numMiners = numOfSources;
            numDrones = 3;
            numWorkers = 5 + numRemoteRooms;


            break;

        //for advanced room state
        case 'ROOM_STATE_ADVANCED':
            
            //1 miner per source to saturate sources, plus 1 miner for each extractor tied to the room
            numMiners = this.memory.sources.length + this.memory.structures[STRUCTURE_EXTRACTOR].length;
            numDrones = 4;
            numWorkers = 4 + numRemoteRooms;

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

    var creepsInRoom = _.map(this.memory.creepsInRoom, name => Game.creeps[name]);
    var numOfRole = _.sum(creepsInRoom, c => c.memory.role === role);

    return numOfRole;
}

