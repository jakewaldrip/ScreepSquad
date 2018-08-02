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
    
    //call the functions for other overlord responsibilities here
    
    _.forEach(this.overseers, overseer => overseer.run());
    
};


/*********************/
/* Private functions */
/*********************/
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

//Export the constructor for the object
module.exports = Overlord;