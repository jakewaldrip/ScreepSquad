/**********************/
/* Public constructor */
/**********************/
function Overseer(room) {
    
    this.name = room.name;
    this.homeRoom = room;
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

/*
{
    run: function() {
        
        if(!Memory.overseers)
            Memory.overseers = {};
            
        _.forEach(Game.rooms, function(room) {
            this.runHomeRoom(room);
            room.getData();
            room.setRoomState();
            room.spawnNextCreep();
        }, this);
    },
    
    runHomeRoom: function(room) {
        if(this.structures && this.structures[STRUCTURE_SPAWN].length > 0){
            
            if(!Memory.overseers[room.name]){
                Memory.overseers[room.name] = {};
            }
            
            
        }
        
        
    }

}
*/