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
require('Traveler');

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
    const HITPOINTSTOFLEE = 1200;
    let attackCreep = Game.creeps["attackBoy2"];
    if(attackCreep != undefined){
        attackCreep.say("Ily bae!");
        if(attackCreep.room.name != "W12S48"){
            if(attackCreep.hits == attackCreep.hitsMax){
                attackCreep.travelTo(new RoomPosition(25, 25, "W12S48"));
            }
            else{
                attackCreep.travelTo(new RoomPosition(25, 48, "W12S47"));
                //attackCreep.move(TOP);
                attackCreep.heal(attackCreep);
            }
        }
        else if(attackCreep.hits > attackCreep.hitsMax - HITPOINTSTOFLEE){
            if(attackCreep.memory.target == null){
                attackCreep.memory.target = "5ba1a2ba79ce12155c3d32c3";
                //creep.memory.target = attackCreep.pos.findClosestByRange(FIND_STRUCTURES);
            }
            let target = Game.getObjectById(attackCreep.memory.target);
            if(attackCreep.rangedAttack(target) == ERR_NOT_IN_RANGE){
            //if(attackCreep.attack(target) == ERR_NOT_IN_RANGE){
                attackCreep.travelTo(target);
                attackCreep.heal(attackCreep);
            }
            else if(attackCreep.rangedAttack(target) == ERR_INVALID_TARGET){
                attackCreep.memory.target = null;
            }
            attackCreep.heal(attackCreep);
        }
        else{
            attackCreep.memory.target = null;
            attackCreep.travelTo(new RoomPosition(attackCreep.pos.x, 48, "W12S47"));
            attackCreep.heal(attackCreep);
        }
    }
    else{
        let body = [];
        body = _.times(6, () => MOVE);
    	body = body.concat(_.times(6, () => RANGED_ATTACK));
    	body = body.concat(_.times(14, () => MOVE) );
    	body = body.concat(_.times(14, () => HEAL) );
        
        if(Game.spawns.Spawn1.spawnCreep( body, "attackBoy2"))
            console.log("Spawning an attackBoy2");
    }
    */
    
});
}
