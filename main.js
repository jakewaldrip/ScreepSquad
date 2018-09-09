'use strict';

const aux_functions = require('auxilliary_functions');
const MemoryManager = require('memory_management');
const Overlord = require('Overlord');
const Overseer = require('Overseer');

/******************/
/*   Prototypes   */
/******************/

require('prototype.creep');
require('prototype.creep_domestic');
require('prototype.creep_military');
require('prototype.creep_remote');
require('prototype.flags');
require('prototype.room');
require('prototype.room_getData');
require('prototype.room_jobs');
require('prototype.room_spawn');
require('prototype.spawn');
require('prototype.structures');
require('prototype.towers');
require('Defcon');
require('prototype.empire_comms');

/******************/
/*      Roles     */
/******************/

require('role.Drone');
require('role.Miner');
require('role.Worker');

global.StatTracker = require('screeps-stats');
const profiler = require('screeps-profiler');

//uncomment the next line to enable profiler
//wiki on how to use it: https://github.com/screepers/screeps-profiler
profiler.enable();

module.exports.loop = function () {
profiler.wrap(function() {

    //clean up memory from no longer existing objects and flags
    MemoryManager.garbageCollection();
    MemoryManager.deadFlagCleaning();
    
    //create the overlord object and run the empire
    var overlord = new Overlord();
    overlord.run(); 
    
     //Leaving it just in case for now, will remove later 
    /*
    //Temporary code to attack neighbor
    let attackCreep = Game.creeps["AttackBoy"];
    if(attackCreep != undefined){
        attackCreep.say("I love you");
        if(attackCreep.room.name != "W42S9"){
            if(attackCreep.isOnExitTile())
            {
                attackCreep.moveAwayFromExit();
            }
            else
            {
                attackCreep.moveTo(new RoomPosition(25, 25, "W42S9"));
            }
        }
        else{
            let target = attackCreep.pos.findClosestByRange(FIND_STRUCTURES);
            if(attackCreep.attack(target) == ERR_NOT_IN_RANGE){
                attackCreep.moveTo(target);
                attackCreep.heal(attackCreep);
            }
        }
    }
    else{
        Game.spawns.Spawn1.spawnCreep( [MOVE, MOVE, ATTACK, ATTACK], "AttackBoy");
    }
    */
    
});
}
