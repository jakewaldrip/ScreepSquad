# ScreepSquad
  <h2>Overlord</h2>
  This class controls the empire. Foreign and inter-room communication. Things such as commiting flags to the memory of the proper room (attack rooms, remote rooms, etc) Trade, claiming new rooms, and inter-room assistance such as resource/man-power shifting to help a less fortune room.
  
  <h2>Overseer</h2>
  This class controls the room. Things such as collecting all the required information about a room, running the AI director, and sending proper information to the memory manager.
  
  <ul>
  <li> assignJobs - Accepts room argument. Runs each of the assignRoleJobs functions.
  <li> assignMinerJobs - accepts room argument. Assigns jobs to all idle miner creeps that belong to the room.</li>
  </ul>
  <h2>Aux Functions</h2>
  These are helper functions. Can be used to do things such as converting an array of ID's into an array of objects, getting distance between rooms or objects, getting movement costs, etc.
  
  <ul>
  <li>getObjectsFromIDArray - accepts an array of object Id's and returns an array of the objects</li>
  </ul>
  <h2>Memory Management</h2>
  This is where all the memory will be handled. This will call & run all the functions/logic to store everything in memory. Garbage collection also occurs here.
  
  <ul>
  <li>garbageCollection - no parameters, cleans up non-existing objects from memory</li>
  </ul>
  <h2>prototype.Creep</h2>
  Creep commands and properties that apply to all creep types.
  <ul>
  <li> Creep.role - returns creep.memory.role.</li>
  <li> Creep.home - returns creep.memory.home.</li>
  <li> Creep.state - returns creep.memory.state</li>
  <li> Creep.workTarget - returns creep.memory.workTarget</li>
  </ul>
  <h2>prototype.Creep_Domestic</h2>
  Creep commands for domestic creeps. Functions such as creep.getEnergy, creep.doWork, etc. (Might be redundant with ai director, we can mess around with it and see how exactly we're gonna make it work)
  
  <ul>
  <li>runMovingDomestic - moves a domestic creep to its target, switches to the proper state upon arrival</li>
  <li>runHarvestingDomestic - gets resources for a domestic creep, switches to proper state when it becomes full</li>
  <li>runWorkDomestic - does the domestic creep's job, switches to proper state when it runs out of energy</li>
  <li>getNextStateDomestic - sets the creep's new state when called</li>
  </ul>
  
  <h2>prototype.Creep_Military</h2>
  Creep commands for military creeps. Functions such as creep.attackSpawn, creep.findTargetWall, creep.fightCreeps, etc. (Might be redundant with ai director, we can mess around with it and see how exactly we're gonna make it work)
  
  <ul>
  <li></li>
  </ul>
  
  <h2>prototype.Creep_Remote</h2>
  Creep commands for remote creeps. Functions such as creep.getEnergy, creep.doWork, creep,switchRooms, etc. (Might be redundant with ai director, we can mess around with it and see how exactly we're gonna make it work)
  
  <ul>
  <li></li>
  </ul>
  
  <h2>prototype.Room</h2>
  Aux type functions for the room. Things such as room.getState, room.setState, room.isOwned, room.isAlly, etc
  
  <ul>
  <li>isOwnedRoom - checks if the room is yours</li>
      -defined as property in room.prototype
  <li>isAllyRoom - checks if the room is owned by a friendly (or you)</li>
      -defined as property in room.prototype
  <li>getStructureObjects - gets all structures objects in a room</li>
      -defined as property in room.prototype
  <li>Room.jobQueues - returns room.memory.jobqueues </li>
  </ul>
  
  <h2>prototype.Room_getData</h2>
  Class by brock that gets all the objects in the room that we need (can be expanded) and stores their ID's in memory. Can be called from the memory manager
  
  <ul>
  <li>getData - calls all various functions to get the objects in a room</li>
  <li>getSources - gets sources in a room</li>
  <li>getStructures - gets structures in a room</li>
  <li>getConstructionSites - gets construction sites in a room</li>
  <li>getDroppedEnergy - gets dropped energy in a room</li>
  <li>getRepairTargets - gets all targets in a room that needs to be repaired</li>
  </ul>
  
  <h2>prototype.Room_Jobs</h2>
  Class that gets the jobQueue by priority for the workers in the room and all the functions related to that.
  
  <ul>
  <li>getJobQueues - calls all various job queue functions</li>
  <li>getMinerJobQueue - gets job queue for the miners</li>
  <li>getWorkerJobQueue - gets job queue for the workers</li>
  <li>getHarvesterJobQueue - gets job queue for the harvesters</li>
  <li>getEnergyJobQueue - gets sources of energy in a room</li>
  </ul>
  
  <h2>prototype.Room_Spawn</h2>
  Class that handles spawning of the room. Will be called by Overseer. functions such as room.getNextCreepToSpawn, room.getCreepCost, room.spawnNextCreep, etc.
  
  <ul>
  <li>getNextCreepToSpawn - gets the role of the next creep that needs to be spawned</li>
  <li>spawnNextCreep - calls functions needed to spawn the next creep needed by the room</li>
  <li>getCreepLimits - gets the number of creeps needed for the room depending on room state and other factors</li>
  <li>getCreepSpawnEnergyCost - gets the energy cost of the next creep needed to spawn</li>
  </ul>
  
  <h2>prototype.Spawn</h2>
  Where we store all of the spawn functions to make the various classes. Such as spawn.createMiner, spawn.createHarvester, etc.
  
  <ul>
  <li>createMiner - accepts homeRoom and energy cost and creates a miner creep</li>
  <li>createWorker - accepts homeRoom and energy cost and creates a worker creep</li>
  <li>createHarvester - accepts homeRoom and energy cost and creates a harvester creep</li>
  </ul>
  
  <h2>prototype.Flags</h2>
  Class written by jake that finds the closest room to the flag you placed down and assigns an object who's key is the flag room name, and will have a numOfSources property applied to it once applicable, but picks 1 source by default.
  
  <ul>
  <li>assignRemoteFlagToRoom - finds the closest owned room to the flagged room and saves it into the owned room's memory</li>
  <li>assignClaimFlagToRoom - same as remote flag but with claiming</li>
  <li>assignAttackFlagToRoom - same as remote flag but with claiming</li>
  <li>assignFlagToRoom - calls the proper function based on the color of the flag</li>
  </ul>
  
  <h2>prototype.Structures</h2>
  Class containing functions to do work or get energy from structures such as container.doWork (inserts energy into the container) and container.getEnergy (pulls energy from the container)
  
  <ul>
  <li></li>
  </ul>
  
  <h2>role.Harvester</h2>
  logic for the harvester to follow the command given by the AI director
  harvester (transporter) fills the spawn, extension, and storage based
  
  <ul>
  <li>run - runs the creep with a state machine that detects the state the creep is in and runs the one function needed</li>
  </ul>
  
  <h2>role.Miner</h2>
  logic for the miner to follow the command given by the AI director
  miner is static on a container next to a source and ensures the maximum amount of energy in the room can be mined
  
  <ul>
  <li>run - runs the creep with a state machine that detects the state the creep is in and runs the one function needed</li>
  </ul>
  
  <h2>role.Worker</h2>
  logic for the worker to follow the command given by the AI director
  worker is the catch all working creep who gets the first job from the jobQueue and finds a new one once that job is complete.
  
  <ul>
  <li>run - runs the creep with a state machine that detects the state the creep is in and runs the one function needed</li>
  </ul>
