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

/******************/
/*      Roles     */
/******************/

require('role.Drone');
require('role.Miner');
require('role.Worker');


module.exports.loop = function () {

    memory_management.garbageCollection();
    
    var overlord = new Overlord();
    overlord.run(); 
}
