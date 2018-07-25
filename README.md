# ScreepSquad
  <h2>Overlord</h2>
  This class controls the empire. Foreign and inter-room communication. Things such as commiting flags to the memory of the proper room (attack rooms, remote rooms, etc) Trade, claiming new rooms, and inter-room assistance such as resource/man-power shifting to help a less fortune room.
  
  <h2>Overseer</h2>
  This class controls the room. Things such as collecting all the required information about a room, running the AI director, and sending proper information to the memory manager.
  
  <h2>Aux Functions</h2>
  These are helper functions. Can be used to do things such as converting an array of ID's into an array of objects, getting distance between rooms or objects, getting movement costs, etc.
  
  <h2>Memory Management</h2>
  This is where all the memory will be handled. This will call & run all the functions/logic to store everything in memory. Garbage collection also occurs here.
  
  <h2>prototype.Creep_Domestic</h2>
  Creep commands for domestic creeps. Functions such as creep.getEnergy, creep.doWork, etc. (Might be redundant with ai director, we can mess around with it and see how exactly we're gonna make it work)
  
  <h2>prototype.Creep_Military</h2>
  Creep commands for military creeps. Functions such as creep.attackSpawn, creep.findTargetWall, creep.fightCreeps, etc. (Might be redundant with ai director, we can mess around with it and see how exactly we're gonna make it work)
  
  <h2>prototype.Creep_Remote</h2>
  Creep commands for remote creeps. Functions such as creep.getEnergy, creep.doWork, creep,switchRooms, etc. (Might be redundant with ai director, we can mess around with it and see how exactly we're gonna make it work)
  
  <h2>prototype.Room</h2>
  Aux type functions for the room. Things such as room.getState, room.setState, room.isOwned, room.isAlly, etc
  
  <h2>prototype.Room_getData</h2>
  Class by brock that gets all the objects in the room that we need (can be expanded) and stores their ID's in memory. Can be called from the memory manager
  
  <h2>prototype.Room_Jobs</h2>
  Class that gets the jobQueue by priority for the workers in the room and all the functions related to that.
  
  <h2>prototype.Room_Spawn</h2>
  Class that handles spawning of the room. Will be called by Overseer. functions such as room.getNextCreepToSpawn, room.getCreepCost, room.spawnNextCreep, etc.
  
  <h2>prototype.Spawn</h2>
  Where we store all of the spawn functions to make the various classes. Such as spawn.createMiner, spawn.createHarvester, etc.
  
  <h2>prototype.Flags</h2>
  Class written by jake that finds the closest room to the flag you placed down and assigns an object who's key is the flag room name, and will have a numOfSources property applied to it once applicable, but picks 1 source by default.
  
  <h2>role.Harvester</h2>
  logic for the harvester to follow the command given by the AI director
  harvester (transporter) fills the spawn, extension, and storage based
  
  <h2>role.Miner</h2>
  logic for the miner to follow the command given by the AI director
  miner is static on a container next to a source and ensures the maximum amount of energy in the room can be mined
  
  <h2>role.Worker</h2>
  logic for the worker to follow the command given by the AI director
  worker is the catch all working creep who gets the first job from the jobQueue and finds a new one once that job is complete.
  
</ul>
