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
    
    //assign dependent room to the main room's overseers
    _.forEach(Game.flags, function (flag) {
        
        let closestRoom = this.assignFlagToRoom();
        let dependentRoom = this.pos.roomName;

        //assign dependent room to the memory of the closest room
        assignFlagToRoom(closestRoom, dependentRoom);
    });
    //------------
    
    
    //run the overseer for each room
    _.forEach(this.overseers, overseer => overseer.run()
	);
    //--------


    //run the creep ai for each creep
    _.forEach(Game.creeps, creep => creep.run()
	);
	//-------
    
};


/*********************/
/* Private functions */
/*********************/

//links all the overseers together within the overlord (reword if im wrong lol)
function linkOverseers() {
    
    let overseers = [];
    
    let Creeps = Game.creeps;
    
    _.forEach(Game.rooms, function(room){
        //Need to sort this by creep role - TO DO
        let creepsInRoom = _.remove(Creeps, c => c.homeRoom == room.name);
        
        room.getData();
        
        if(room.memory.structures[STRUCTURE_SPAWN].length > 0){
            let overseer = new Overseer(room, creepsInRoom);
            overseers.push(overseer);
        }
        
    });
    
    return overseers;
    
};


//saves the remote room within the memory of the assigned Overseer
Overlord.prototype.assignFlagToRoom = function(closestRoom, depedentRoom) {
    
    //get the overseer that will be assigned the dependent room
    var assignedOverseer = _.find(this.overseers, o => o.name === closestRoom);
    
    //save this room into memory as an object with the property sources
    //sets default to 1 source, subject to change once a creep enters the room and finds the real number
    assignedOverseer.remoteRooms.push({
        depedentRoom: sources = 1
    });

};


//Export the constructor for the object
module.exports = Overlord;
