/**
 * @constructor
 * @property {Overlord} Overlord Contains the parent Overlord reference
 * @property {string} name Shorthand for Overseer.homeRoom.name
 * @property {Room} homeRoom The object for the Overseer's homeRoom
 * @property {Creep[]} creeps The Creeps that are assigned to homeRoom
 * @property {Object} remoteRooms Contains string name, int sources, int reservationTTL
 * @property {Object} claimRooms Contains string name, boolean isOwned
 * @property {Object} attackRooms Contains string name, ???
 * @param {Room} room The homeRoom of the Overseer
 * @param {Creep[]} creeps An array of the creeps assigned to the room
 */
function Overseer(room, creeps, overlord) {
    
    this.Overlord = overlord;
    this.name = room.name;
    this.homeRoom = room;
    this.creeps = creeps;
    /**
     * @property {string} name The name of the remoteRoom
     * @property {number} sources The number of sources in the room.
     * @property {number} reservationTTL The number of ticks of reservation left.
     */
    this.remoteRooms = {};
    this.claimRooms = {};
    this.attackRooms = {};
};


/*****************************/
/* Public Overseer Functions */
/*****************************/
Overseer.prototype.run = function() {
       
    //Populate room memory
    this.objectsToMemory();
    
    //Get stats for grafana
    global.StatTracker.getStats(this.homeRoom);
    
    //Run Home Room
    this.homeRoom.setRoomState();
    this.homeRoom.spawnNextCreep();
    this.homeRoom.runTowers();
    
    //simulate remoteRooms TTL
    this.updateReservationTimers();
    this.updateSourceCounts();
};
//---------


//call various functions to save objects to memory
Overseer.prototype.objectsToMemory = function () {

    //save creeps to memory
    this.homeRoom.memory.creepsInRoom = _.map(this.creeps, c => c.name);

    //call remote rooms to memory
    this.remoteToMemory();
    this.claimToMemory();
}
//-------


//save remote rooms to memory
Overseer.prototype.remoteToMemory = function () {

    if (!this.homeRoom.memory.remoteRooms) {
        this.homeRoom.memory.remoteRooms = {};
    }

    _.forEach(Object.keys(this.remoteRooms), function (roomName) {
        this.homeRoom.memory.remoteRooms[roomName] = this.remoteRooms[roomName];
    }, this);
};
//------------

//save claim rooms to memory
Overseer.prototype.claimToMemory = function () {
    
    if (!this.homeRoom.memory.claimRooms) {
        this.homeRoom.memory.claimRooms = {};
    }
    
    _.forEach(Object.keys(this.claimRooms), function(roomName) {
        this.homeRoom.memory.claimRooms[roomName] = this.claimRooms[roomName];
    }, this);
}

//Update Reservation Timers
Overseer.prototype.updateReservationTimers = function () {
    
    _.forEach(Object.keys(this.homeRoom.memory.remoteRooms), function (roomName) {
        //memory object
        let remoteInMemory = this.homeRoom.memory.remoteRooms[roomName];
        let room = Game.rooms[roomName];
        //If we don't have vision of the room, simulate the TTL (inaccurate if we were to be attacked)
        if(room == undefined){
            
            if(remoteInMemory.reservationTTL > 0){
                remoteInMemory.reservationTTL -= 1;
            }
            
        }
        //If we have vision, update with the real TTL
        else{
            
            if(room.controller != undefined){
                //If reservation is undefined, the controller isn't reserved
                if(room.controller.reservation == undefined)
                    remoteInMemory.reservationTTL = 0;
                else
                    remoteInMemory.reservationTTL = room.controller.reservation.ticksToEnd;
            }
        }
        
    }, this);
}

//Update source count in remoteRooms
//Only uses already generated objects, so should be minimal CPU each tick even though it doesn't need run more than once.
Overseer.prototype.updateSourceCounts = function () {
    
    _.forEach(Object.keys(this.homeRoom.memory.remoteRooms), function(roomName) {
        //If getData has been performed for the remoteRoom, pull the number of sources from it's memory
        if(Memory.rooms[roomName] != undefined)
            this.homeRoom.memory.remoteRooms[roomName].sources = _.size(Memory.rooms[roomName].sources);
        
    }, this);
}
/*********************/
/* Private functions */
/*********************/

module.exports = Overseer;
