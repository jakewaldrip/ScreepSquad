'use strict';


//get defcon level for the room
//Called from Room.get_data, so that remoteRooms have a defcon too
Room.prototype.getDefconLevel = function ()
{
    var defcon = 0;
    
    if(this.memory.enemies.combatCreeps.length > 0)
        defcon = 1;
        
        
    this.memory.defcon = defcon;
}
//---------------
