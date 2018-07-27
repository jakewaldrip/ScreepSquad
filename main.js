const aux_functions = require('auxilliary_functions');
const memory_management = require('memory_management');
const overlord = require('Overlord');
const overseer = require('Overseer');

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

require('role.Harvester');
require('role.Miner');
require('role.Worker');


module.exports.loop = function () {
        
    //Example usage, can be relocated
    _.forEach(Game.rooms, function(room) {
        room.getData();
        room.getJobQueues();
        overseer.assignJobs(room);
    })
    _.forEach(Game.rooms, room => room.getData() );    
    
    _.forEach(Game.rooms, room => room.getJobQueues() );

}
