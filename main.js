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
    
    //Temporary auto-construct code
    
    if(Game.rooms["E1S9"].controller.level == 3){
        let room = Game.rooms["E1S9"];
        if(Game.flags["Flag12"] != undefined){
            let flag = Game.flags["Flag12"].pos;
            room.createConstructionSite(flag.x, flag.y+1, STRUCTURE_EXTENSION);
            room.createConstructionSite(flag.x, flag.y-1, STRUCTURE_EXTENSION);
            room.createConstructionSite(flag.x+1, flag.y, STRUCTURE_EXTENSION);
            room.createConstructionSite(flag.x-1, flag.y, STRUCTURE_EXTENSION);
            room.createConstructionSite(flag.x, flag.y, STRUCTURE_EXTENSION);
            
            room.createConstructionSite(27, 14, STRUCTURE_TOWER);
            
            Game.flags["Flag12"].remove();
        }
    }
    
    
     //Leaving it just in case for now, will remove later 
    
    //Temporary code to attack neighbor
    const HITPOINTSTOFLEE = 1000;
    let attackCreep = Game.creeps["attackBoy2"];
    let targetRoom = "E3S8";
    let homeRoom = "E2S8";
    //change to target structures or creeps
    let onlyStructures = false;
    let manualTarget = null;
    
    if(attackCreep != undefined){
        //only works if room is adjacent to home
        if(attackCreep.room.name != targetRoom){
            if(attackCreep.hits == attackCreep.hitsMax){
                attackCreep.travelTo(new RoomPosition(25, 25, targetRoom));
            }
            else{
                attackCreep.travelTo(new RoomPosition(25, 48, homeRoom));
                //attackCreep.move(TOP);
                attackCreep.heal(attackCreep);
            }
        }
        else if(attackCreep.hits > attackCreep.hitsMax - HITPOINTSTOFLEE){
            
            //attackCreep.travelTo(new RoomPosition(25, 25, targetRoom));
            
            //Uses manualTarget > memoryTarget > newTarget
            let target = Game.getObjectById(manualTarget);
            if(target == null)
                target = Game.getObjectById(attackCreep.memory.target);
            
            //decide whether to hit structures or creeps
            if(target == null){
                if(onlyStructures)
                    target = attackCreep.pos.findClosestByRange(FIND_STRUCTURES);
                else
                    target = attackCreep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

                //if(target == null)
                    //target = attackCreep.pos.findClosestByRange(FIND_STRUCTURES);
                    
            }
            if(target != null)
                attackCreep.memory.workTarget = target.id;
            else
                attackCreep.memory.workTarget = null;
                
            if(target == null && attackCreep.hits < attackCreep.hitsMax)
                attackCreep.heal(this)
            else if(target != null)
                attackCreep.runAttackingMilitary();
            else
                attackCreep.travelTo(new RoomPosition(25, 25, targetRoom));
        }
        else{
            attackCreep.memory.target = null;
            //move straight UP into homeRoom
            attackCreep.travelTo(new RoomPosition(attackCreep.pos.x, 48, homeRoom));
            attackCreep.heal(attackCreep);
        }
    }
   
    //Basic attacker
    else{
        let body = [TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, HEAL];
        //let body = [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL];
        //if(Game.spawns.Spawn1.spawnCreep( body, "attackBoy2") == 0)
        //    console.log("Spawning an attackboy2");
    }
    // Use this one for extra remote defense
    /*
    else{
        let body = [RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,  RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL];
        if(Game.spawns.Spawn1.spawnCreep( body, "attackBoy2") == 0)
            console.log("Spawning an attackBoy2");
    }
    */
    //Use this one for breaking towers
    /*
    else{
        let body = [];
        body = _.times(6, () => MOVE);
    	body = body.concat(_.times(6, () => RANGED_ATTACK));
    	body = body.concat(_.times(14, () => MOVE) );
    	body = body.concat(_.times(14, () => HEAL) );
        
        if(Game.spawns.Spawn1.spawnCreep( body, "attackBoy2") == 0)
            console.log("Spawning an attackBoy2");
    }
    */
    
    //attackCreep.travelTo(new RoomPosition(30, 15, targetRoom));
});
}
