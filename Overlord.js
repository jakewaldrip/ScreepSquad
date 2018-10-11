/** 
 * @namespace Overlord
 * @requires Overseer
 */

const Overseer = require('Overseer');

/**
 * Creates an Overlord
 * <p> The Overlord runs the empire at the top level. </p>
 * @class
 * @constructor
 */
function Overlord() {
    
    this.overseers = this.linkOverseers();
    this.requestHelp = this.getRequestHelpRooms();
    this.sendHelp = this.getSendHelpRooms();
    
};

/** Calls all of the other functions Overlord runs each tick. */
Overlord.prototype.run = function() {
    
    //Assign remote rooms back to the overseers.
    this.assignFlags();
    
    //run the overseer for each room
    _.forEach(this.overseers, overseer => overseer.run()
	);
    //--------


    //run the creep ai for each creep
    _.forEach(Game.creeps, creep => creep.run()
	);
    //-------
    
};

/** 
 * Assigns all flags to Overseers
 * <p>Assignment depends on flag type and distance to an Overseer room.
 * See {@link Flag#assignFlagToRoom} for how this is done.
 */
Overlord.prototype.assignFlags = function() {

    //assign dependent room to the main room's overseers
    _.forEach(Game.flags, function (flag) {
        
        //assignFlagToRoom splits flags by color and runs their assignment functions
        //which returns null if already assigned, or [flagType, roomName] if now assigned.
        let assignment = flag.assignFlagToRoom();
        
        if(assignment != null){
            
            //"Remote" "Claim" "Attack"
            let flagType = assignment[0];
            //Room name
            let homeRoom = assignment[1];
            
            let dependentRoom = flag.pos.roomName;
    
    		//if closestRoom is null, the flag is already assigned somewhere so don't waste cpu on it
    		if(homeRoom != null)
    		{
    			//assign dependent room to the memory of the closest room
    			this.assignOverseerFlag(homeRoom, dependentRoom, flagType);
    		}
    		
        }
    }, this);
    //------------
    
    
};

/**
 * Saves remote rooms into the memory of assigned Overseers.
 * @param {string} homeRoom
 * @param {string} dependentRoom
 * @param {string} flagType
 */
Overlord.prototype.assignOverseerFlag = function(homeRoom, dependentRoom, flagType) {
    
    //get the overseer that will be assigned the dependent room
    var assignedOverseer = _.find(this.overseers, o => o.name === homeRoom);
    
    //save this room into memory as an object with the property sources
    //sets default to 1 source, subject to change once a creep enters the room and finds the real number
    if(flagType == "Remote")
    {
    	assignedOverseer.remoteRooms[dependentRoom] = {name: dependentRoom, sources: 1, reservationTTL: 0};
    }
    else if(flagType == "Claim")
    {
        assignedOverseer.claimRooms[dependentRoom] = {name: dependentRoom, isClaimed: false};
    }
    else if(flagType == "Attack")
    {
        //thinking we might have to handle attack flags specially
        //like might have to assign it to multiple rooms to bombard an enemy
        //place holder to make sure we keep scalability in mind
    }
        

};

//links all the overseers to the overlord
/**
 * Creates and links all Overseer objects to Overlord's Memory.
 * @return {Overseer[]}
 */
Overlord.prototype.linkOverseers = function() {
    
    let overseers = [];
    
    let Creeps = _.map(Object.keys(Game.creeps), name => Game.creeps[name]);
    
    _.forEach(Game.rooms, function(room){
        
        room.getData();
        
        let spawnIDs = room.memory.structures[STRUCTURE_SPAWN];
        
        //if(spawnIDs.length > 0 && Game.getObjectById(spawnIDs[0]).my){
        if(room.controller && room.controller.my){
            //Need to sort this by creep role - TO DO
            let creepsInRoom = _.remove(Creeps, c => c.homeRoom == room.name);
            
            let overseer = new Overseer(room, creepsInRoom, this);
            overseers.push(overseer);
        }
        
    });
    
    return overseers;
    
};


/*
* Get all rooms that need help and the type of help they need
* @return {Object} array of objects containing the rooms that need help and what help they need
* form for object is [requestingRoom, typeOfHelp]
*/
Overlord.prototype.getRequestHelpRooms = function()
{
    
    return null;
}
//------------------


/*
* Get all rooms that can help and the type of help they're sending
* @param {Object} helpObject : [requestingRoom, typeOfHelp]
* @return {Object} array of objects containing the rooms that are helping and what help they are sending
* form for object is [helpingRoom, typeOfHelp]
*/
Overlord.prototype.getSendHelpRooms = function(helpObject)
{
    
    return null;
}
//------------------


//Export the constructor for the object
module.exports = Overlord;
