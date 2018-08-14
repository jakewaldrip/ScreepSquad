const Overseer = require('Overseer');
//Maybe this class can handle things like requesting one overseer 
// to send reinforcements to another overseer


    /**********************/
    /* Public constructor */
    /**********************/
    
function Overlord() {
    
    this.overseers = linkOverseers();
    
};


    /*****************************/
    /* Public Overlord Functions */
    /*****************************/
    
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

//saves the remote room within the memory of the assigned Overseer
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

    /*********************/
    /* Private functions */
    /*********************/

//links all the overseers to the overlord
function linkOverseers() {
    
    let overseers = [];
    
    let Creeps = _.map(Object.keys(Game.creeps), name => Game.creeps[name]);
    
    _.forEach(Game.rooms, function(room){
        
        room.getData();
        
        let spawnIDs = room.memory.structures[STRUCTURE_SPAWN];
        
        if(spawnIDs.length > 0 && Game.getObjectById(spawnIDs[0]).my){
            //Need to sort this by creep role - TO DO
            let creepsInRoom = _.remove(Creeps, c => c.homeRoom == room.name);
            
            let overseer = new Overseer(room, creepsInRoom);
            overseers.push(overseer);
        }
        
    });
    
    return overseers;
    
};


//Export the constructor for the object
module.exports = Overlord;
