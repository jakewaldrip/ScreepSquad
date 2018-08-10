/**********************/
/* Public constructor */
/**********************/
function Overseer(room, creeps) {
    
    this.name = room.name;
    this.homeRoom = room;
    this.creeps = creeps;
    this.remoteRooms = {};
    this.claimRooms = {};
    
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
};
//---------


//call various functions to save objects to memory
Overseer.prototype.objectsToMemory = function () {

    //save creeps to memory
    this.homeRoom.memory.creepsInRoom = _.map(this.creeps, c => c.name);

    //call remote rooms to memory
    this.remoteToMemory();
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


/*********************/
/* Private functions */
/*********************/

module.exports = Overseer;
