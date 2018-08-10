//handles spawning for each room

//get the next creep to spawn
//Will spawn one of each creep type with a limit > 0
//and then max out each spawn in order of rolePriority.
Room.prototype.getNextCreepToSpawn = function () {

    this.getCreepLimits();
    
    //Ascending Priority - Miner -> Drone -> Worker
    //Important for the proper queueing of creeps.
    const rolePriority = [
        "remoteMiner",
        "remoteDrone",
        "remoteReserver",
        "claimer",
        "worker",
        "drone",
        "miner"
    ];
    
    let nextCreep, counts = {};
    
    _.forEach(rolePriority, function(role) {
        
        counts[role] = this.getCreepSum(role);
        
        if(counts[role] < this.memory.creepLimits[role]){
            //Keeps the number of each role even, instead of building one to max before building a second of the other role
            if(nextCreep == null || counts[nextCreep] >= counts[role])
                nextCreep = role;
        }
        
    }, this);
    
    
    return nextCreep;
}
//-----


//This function runs getNextCreepToSpawn, getCreepSpawnEnergyCost, and then passes
//the params to spawner.createRole, assuming there is an available spawn.
Room.prototype.spawnNextCreep = function () {
    let spawns = this.memory.structures[STRUCTURE_SPAWN].getObjects();
    let emptySpawner = _.find(spawns, spawn => spawn.spawning == null);
    
    if(emptySpawner != null){
        
        let role = this.getNextCreepToSpawn();
        
        if(role != undefined){
            
            let energyCost = this.getCreepSpawnEnergyCost(role);

            if(this.energyAvailable >= energyCost){
                
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
    
    //roomstate Intro
    var roleMaxCost = {
        miner: 250,
        drone: 200,
        worker: 300
    };
    
    if(roomState == "ROOM_STATE_BEGINNER"){
        roleMaxCost = {
            miner: 700,
            drone: 1200,
            worker: 1700
        };
    }
    else if(roomState == "ROOM_STATE_INTERMEDIATE"){
        roleMaxCost = {
            miner: 700,
            drone: 1200,
            worker: 1700,
            remoteMiner: 900,
            remoteDrone: 1500,
            remoteReserver: 1400,
            claimer: 700
        };
    }
    else if(roomState == "ROOM_STATE_ADVANCED"){
        roleMaxCost = {
            miner: 700,
            drone: 2000,
            worker: 2500,
            remoteMiner: 900,
            remoteDrone: 2000,
            remoteReserver: 1400,
            claimer: 700 
        };
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

    //all creep roles we are calculating limit for
    var numMiners = 0;
    var numDrones = 0;
    var numWorkers = 0;
    var numRemoteMiners = 0;
    var numRemoteDrones = 0;
    var numReservers = 0;
    var numClaimers = 0;
    
    var energyCap = this.energyCapacityAvailable;


    //depedent rooms and sources
    let numRemoteRooms = Object.keys(this.memory.remoteRooms).length;
    let numRemoteSources = 0
    //let numClaimRooms = Object.keys(this.memory.claimRooms).length;
    let numOfSources = Object.keys(this.memory.sources).length;
    
    //get number of remote sources for all remote rooms connected to this room
    for (var i = 0; i < numRemoteRooms; ++i) 
    {
        numRemoteSources += this.memory.remoteRooms[i]["numSources"];
    }
    
    
    //get creep limits for each room state
    switch(roomState)
    {
        case 'ROOM_STATE_INTRO':
            
            numMiners = 1;
            numDrones = 1;
            numWorkers = 1;
            
        break;
        
        
        //for beginner room state
        case 'ROOM_STATE_BEGINNER':
            
            let workPerCreep = 2 * Math.floor(this.energyCapacityAvailable / (BODYPART_COST["work"] * 2 + BODYPART_COST["move"] * 1));
            
            //get number of miners needed to saturate the sources
            let numMinersPerSource = Math.ceil(5 / workPerCreep);
            
            _.forEach(this.memory.sources, function(source) {
                
                if(numMinersPerSource > source.accessTiles.length)
                    numMiners += source.accessTiles.length;
                else
                    numMiners += numMinersPerSource;
                    
            });
            
            //change creep limits based on available energy
            if (energyCap < 600)
            {
                numDrones = 4;
                numWorkers = 6;
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
            numDrones = 4;
            numWorkers = 6 + numRemoteSources;
            
            //1 remote squad per remote source
            numRemoteMiners = numRemoteSources;
            numRemoteDrones = numRemoteSources;
            
            //1 reserver or claimer per room they need to cover
            numReservers = numRemoteRooms;
            numClaimers = numClaimRooms;

            break;

        //for advanced room state
        case 'ROOM_STATE_ADVANCED':
            
            //1 miner per source to saturate sources, plus 1 miner for each extractor tied to the room
            numMiners = numOfSources + this.memory.structures[STRUCTURE_EXTRACTOR].length;
            numDrones = 2;
            numWorkers = 4 + numRemoteRooms;
            
            //1 remote squad per remote source
            numRemoteMiners = numRemoteRooms;
            numRemoteDrones = numRemoteRooms;
            
            //1 reserver or claimer per room they need to cover
            numReservers = numRemoteRooms;
            //numClaimers = numClaimRooms;

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
    this.memory.creepLimits["remoteMiner"] = numRemoteMiners;
    this.memory.creepLimits["remoteDrone"] = numRemoteDrones;
    this.memory.creepLimits["remoteReserver"] = numReservers;
    this.memory.creepLimits["claimer"] = numClaimers;
}
//------


//passes creep role and returns the number of existing creeps in the room of this role
Room.prototype.getCreepSum = function (role) {

    var creepsInRoom = _.map(this.memory.creepsInRoom, name => Game.creeps[name]);
    var numOfRole = _.sum(creepsInRoom, c => c.memory.role === role);

    return numOfRole;
}

