const aux_functions = require('auxilliary_functions');
const memory_management = require('memory_management');
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

/******************/
/*      Roles     */
/******************/

require('role.Drone');
require('role.Miner');
require('role.Worker');

const profiler = require('screeps-profiler');

//uncomment the next line to enable profiler
//wiki on how to use it: https://github.com/screepers/screeps-profiler
//profiler.enable();
module.exports.loop = function () {
profiler.wrap(function() {

    memory_management.garbageCollection();
    
    var overlord = new Overlord();
    overlord.run(); 
    
});
}
