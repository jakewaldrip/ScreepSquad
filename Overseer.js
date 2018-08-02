/**********************/
/* Public constructor */
/**********************/
function Overseer(room, creeps) {
    
    this.name = room.name;
    this.homeRoom = room;
    this.creeps = creeps;
    this.remoteRooms = [];
    
};


/*****************************/
/* Public Overseer Functions */
/*****************************/
Overseer.prototype.run = function() {
       
    //room.getData();
    this.homeRoom.setRoomState();
    this.homeRoom.spawnNextCreep();
};


/*********************/
/* Private functions */
/*********************/




module.exports = Overseer;