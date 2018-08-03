/**********************/
/* Public constructor */
/**********************/
function Overseer(room, creeps) {
    
    this.name = room.name;
    this.homeRoom = room;
    this.creeps = creeps;
    this.remoteRooms = {};
    
};


/*****************************/
/* Public Overseer Functions */
/*****************************/
Overseer.prototype.run = function() {
       
    //Run Home Room
    this.homeRoom.setRoomState();
    this.homeRoom.spawnNextCreep();
    
    //Run Remote Rooms
    this.remoteToMemory();
    
};


Overseer.prototype.remoteToMemory = function(){
    
    if(!this.homeRoom.memory.remoteRooms){
        this.homeRoom.memory.remoteRooms = {};
    }
    
    _.forEach(Object.keys(this.remoteRooms), function(roomName) {
        this.homeRoom.memory.remoteRooms[roomName] = this.remoteRooms[roomName];
    }, this);
}


/*********************/
/* Private functions */
/*********************/

module.exports = Overseer;
