/**********************/
/* Public constructor */
/**********************/
function Overseer(room, creeps) {
    
    this.name = room.name;
    this.homeRoom = room;
    this.creeps = creeps;
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
    
    //Run Home Room
    this.homeRoom.setRoomState();
    this.homeRoom.spawnNextCreep();
    this.homeRoom.runTowers();
    
    //simulate remoteRooms TTL
    this.updateReservationTimers();
    //this.updateSourceCount();
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
    });
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
/*********************/
/* Private functions */
/*********************/

module.exports = Overseer;
