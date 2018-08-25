/** @namespace Defcon */
'use strict';

/**
 * Gets the Defcon level for the room
 * <p> Is called in {@link room_getData} </p>
 */
Room.prototype.getDefconLevel = function ()
{
    var defconLevel;
    var enemies = this.memory.enemies;
    var combatEnemies = this.memory.enemies.combatCreeps;
    var healingEnemies;
    var roomName = this.name;

    //set defcon to what it was last tick, 0 if this is the first check
    if (this.memory.defcon != undefined)
    {
        defconLevel = this.memory.defcon;
    }
    else
    {
        defconLevel = 0;
    }
    
    //if we were previously in a state of defcon, check if we still need to be
    if (defconLevel > 0)
    {
        //if we have vision in the room
        if(Game.rooms[roomName] != undefined)
        {
            //check if theres enemies
            if(combatEnemies.length > 0)
            {
                defconLevel = 1;
            }
            else
            {
                defconLevel = 0;
            }
        }
        else
        {
            //This line could have the consequence of spawning a remoteDefender for each new remoteRoom
            //Since they would be considered a higher priority spawn than the miners
            //no vision, assume we still in danger until a defender goes and checks it out
            defconLevel = 1;
        }
    }
    else
    {
        //previously no defcon, just check for enemies
        if(combatEnemies.length > 0)
        {
            defconLevel = 1;
        }
        else
        {
            defconLevel = 0;
        }
    }
        
    
    this.memory.defcon = defconLevel;
}
//---------------
