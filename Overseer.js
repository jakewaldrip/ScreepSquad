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
       
    //Populate room memory
    this.remoteToMemory();
    this.creepsToMemory();
    
    //Run Home Room
    this.homeRoom.setRoomState();
    this.homeRoom.spawnNextCreep();
    this.homeRoom.runTowers();
    
};


Overseer.prototype.creepsToMemory = function() {
    
    this.homeRoom.memory.creepsInRoom = _.map(this.creeps, c => c.name);
    
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
