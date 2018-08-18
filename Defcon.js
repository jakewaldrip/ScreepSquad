/** @namespace Defcon */
'use strict';

/**
 * Gets the Defcon level for the room
 * <p> Is called in {@link room_getData} </p>
 */
Room.prototype.getDefconLevel = function ()
{
    var defcon = 0;
    
    if(this.memory.enemies.combatCreeps.length > 0)
        defcon = 1;
        
        
    this.memory.defcon = defcon;
}
//---------------
