
/** @namespace Room_Spawn */
//handles spawning for each room

//get the next creep to spawn
//Will spawn one of each creep type with a limit > 0
//and then max out each spawn in order of rolePriority.
Room.prototype.getNextCreepToSpawn = function () {

    this.getCreepLimits();
    
    //Ascending priority. Will spawn from bottom to top keeping equal counts
    const remotePriority = [
        "remoteReserver",
        "remoteDrone",
        "remoteMiner",
        "claimer"
    ];
    const domesticPriority = [
        "worker",
        "drone",
        "miner"
    ];
    const combatPriority = [
        "remoteDefender"
    ];
    const priorityList = combatPriority.concat(domesticPriority, remotePriority);
    
    
    let nextCreep, counts = {};
    
    _.forEach(priorityList, function(role) {
            
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
        let dependentRoom = null;
        
        if(role != undefined){
            
            let energyCost = this.getCreepSpawnEnergyCost(role);

            if(this.energyAvailable >= energyCost){
                
                //if creep is a remote creep, set dependentRoom to first room thats not fully worked
                if(role === 'remoteMiner' || role === 'remoteDrone' || role === 'remoteReserver')
                {
                   dependentRoom = this.getOpenDependentRoom(role);
                }
                else if(role === 'remoteDefender'){
                    dependentRoom = this.getOpenDefenseRoom(role);
                }
                //create the creep using the available spawner
                emptySpawner.createRole(this.name, energyCost, role, dependentRoom);
                    
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
            remoteMiner: 1000,
            remoteDrone: 1500,
            remoteReserver: 1500,
            remoteDefender: 950,
            claimer: 850
        };
    }
    else if(roomState == "ROOM_STATE_ADVANCED"){
        roleMaxCost = {
            miner: 700,
            drone: 2000,
            worker: 2500,
            remoteMiner: 1000,
            remoteDrone: 2000,
            remoteReserver: 1500,
            remoteDefender: 950,
            claimer: 850
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


//get limit of the creeps for the room (calls all dependent functions)
Room.prototype.getCreepLimits = function ()
{

    //number of remote rooms
    let numRemoteRooms = Object.keys(this.memory.remoteRooms).length;

    //number of sources in the remote room
    let numRemoteSources = 0;
    _.forEach(this.memory.remoteRooms, room => numRemoteSources += room.sources);
    
    //number of rooms that need a reserver sent to it
    let numReserveRooms = _.filter(this.memory.remoteRooms, room => room.reservationTTL < 4500).length;

    //number of claim rooms attached to the room
    let numClaimRooms = Object.keys(this.memory.claimRooms).length;
    
    //number of sources in the home room
    let numOfSources = Object.keys(this.memory.sources).length;

    //set empty creep limit object
    this.memory.creepLimits = {};

    //get domestic creep limits
    this.getDomesticCreepLimits(numOfSources, numRemoteRooms);

    //get remote creep limits
    this.getRemoteCreepLimits(numRemoteRooms, numRemoteSources, numReserveRooms, numClaimRooms);

    //get combat creep limits
    this.getCombatCreepLimits();
}
//------------


//get limit of domestic creeps in the room
Room.prototype.getDomesticCreepLimits = function (numOfSources, numRemoteRooms)
{

    var roomState = this.memory.roomState;

    //all creep roles we are calculating limit for
    var numMiners = 0;
    var numDrones = 0;
    var numWorkers = 0;
    

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
            numWorkers = 6 + numRemoteRooms;
            
            break;

        //for advanced room state
        case 'ROOM_STATE_ADVANCED':
            
            //1 miner per source to saturate sources, plus 1 miner for each extractor tied to the room
            numMiners = numOfSources + this.memory.structures[STRUCTURE_EXTRACTOR].length; //+ this.memory.remoteRooms.extractors.length
            numDrones = 2;
            numWorkers = 4 + numRemoteRooms;
            
            break;


        default:

            console.log("Invalid room_state passed to getCreepLimits");

            break;
    }

    //commit values to memory from here
    this.memory.creepLimits["miner"] = numMiners;
    this.memory.creepLimits["drone"] = numDrones;
    this.memory.creepLimits["worker"] = numWorkers;
}
//-----------


//get limit of remote creeps in the room
Room.prototype.getRemoteCreepLimits = function (numRemoteRooms, numRemoteSources, numReserveRooms, numClaimRooms)
{

    var numRemoteMiners = 0;
    var numRemoteDrones = 0;
    var numReservers = 0;
    var numClaimers = numClaimRooms;

    var roomState = this.memory.roomState;

    switch(roomState)
    {
        case 'ROOM_STATE_INTERMEDIATE':

            numRemoteMiners = numRemoteSources;
            numRemoteDrones = numRemoteSources * 2;
            numReservers = numReserveRooms;

            break;


         case 'ROOM_STATE_ADVANCED':

            numRemoteMiners = numRemoteSources;
            
            if(this.energyCapacityAvailable < 2500)
            {
                numRemoteDrones = numRemoteSources * 2;
            }
            else
            {
                numRemoteDrones = numRemoteSources;
            }

            numReservers = numReserveRooms;

            break;

          
         default:
            //if not at least room state intermediate then won't spawn any remote creeps
            break;
    }

    //commit values to memory from here
    this.memory.creepLimits["remoteMiner"] = numRemoteMiners;
    this.memory.creepLimits["remoteDrone"] = numRemoteDrones;
    this.memory.creepLimits["remoteReserver"] = numReservers;
    this.memory.creepLimits["claimer"] = numClaimers;
}
//-----------


//get limit of combat creeps in the room
Room.prototype.getCombatCreepLimits = function ()
{
    var numRemoteDefenders = 0;
    
    //1 remoteDefender per level of defcon in remote rooms
    numRemoteDefenders = _.sum(this.memory.remoteRooms, room => room.defcon);
    
    //console.log(numRemoteDefenders);
    this.memory.creepLimits["remoteDefender"] = numRemoteDefenders;
}
//------------


//passes creep role and returns the number of existing creeps in the room of this role
Room.prototype.getCreepSum = function (role) {

    var creepsInRoom = _.map(this.memory.creepsInRoom, name => Game.creeps[name]);
    var numOfRole = _.sum(creepsInRoom, c => c.memory.role === role);

    return numOfRole;
}


//returns first remote room thats not fully worked
Room.prototype.getOpenDependentRoom = function (role) {
   
    let dependentRoom = null;
    //find first remote room that is not fully worked
    let remoteRooms = Object.keys(this.memory.remoteRooms);
    
    //all creeps in the room of this role
    let creepsInRoom = _.map(this.memory.creepsInRoom, name => Game.creeps[name]);
    let creepsInRole = _.filter(creepsInRoom, c => c.memory.role === role);
    
    let creepsPerSource = 1;
    
    if(role == "remoteDrone" && this.energyCapacityAvailable < 2500){
        creepsPerSource = 2;
    }
    
    //loop over remote rooms and break on first one without 
    for(let i = 0; i < remoteRooms.length; i++)
    {
        //number of sources in room should be number of creeps working the room
        let currentRoom = this.memory.remoteRooms[ remoteRooms[i] ];
        
        //Don't send a reserver to a nearly fully reserved room, and limit to .5 per source(1max/room)
        if(currentRoom.reservationTTL >= 4500 && role == "remoteReserver")
            creepsPerSource = 0;
        else if(role == "remoteReserver")
            creepsPerSource = .5;
            
            
        let numSources = currentRoom["sources"];
        let numCreepsAssigned = _.filter(creepsInRole, c => c.memory.remoteRoom === currentRoom.name).length;
        
        //if the number of creeps assigned is less than the number of sources, assign dependent room to this one
        if(numCreepsAssigned < Math.ceil(numSources * creepsPerSource) )
        {
           dependentRoom = currentRoom["name"];
           break;
        }
    }
    
    return dependentRoom;
}

/**
 * Finds the first remote room that is in need of defense
 * @param {string} role The role we're checking the need for
 * @return {string} defenseRoom The name of the room in need of defense
 */
Room.prototype.getOpenDefenseRoom = function (role) {
    
    var defenseRoom = null;
    
    var remoteRooms = Object.keys(this.memory.remoteRooms);
    
    _.forEach(remoteRooms, function(roomName) {
        
        let room = Game.rooms[roomName];
        let defcon;
        
        //Use the room's memory if visible, homeRooms memory if not
        if(room != undefined)
            defcon = room.memory.defcon;
        else
            defcon = this.memory.remoteRooms[roomName].defcon;
            
        if(defcon == 1 && role == "remoteDefender"){
            defenseRoom = roomName;
        }
    });
    
    return defenseRoom;
}
//--------

