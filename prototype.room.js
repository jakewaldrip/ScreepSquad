/** @namespace Room */
Room.prototype.runTowers = function() {
    
    let towers = this.memory.structures[STRUCTURE_TOWER].getObjects();
    
    _.forEach(towers, tower => tower.run());
    
}
//-------


/*
 * Run the links for the room
 */
Room.prototype.runLinks = function() {

    var allLinks = this.memory.structures[STRUCTURE_LINK].getObjects();
    var controller = this.controller;
    var upgraderLink;
    var supportLinks;


    //if the memory slot for upgrader link is defined, continue, else add it
    if(this.memory.upgraderLink != undefined && this.memory.upgraderLink != null){
               
        //convert into objects what is needed
        upgraderLink = this.memory.upgraderLink.getObjects();
        supportLinks = _.filter(allLinks, l => l !== upgraderLink);
        
        //loop over the support links and run them
        for(let i = 0; i < supportLinks.length; ++i){
                
            //variable in loop to keep logic clear
            let currentLink = supportLinks[i];
            let energyCap = currentLink.energyCapacity;
            let currentEnergy = currentLink.energy;
            let currentCooldown = currentLink.cooldown;
            let upgraderLinkEnergy = upgraderLink.energy;
            
            //check if upgrader link needs energy
			//set it to cap-1 because it costs energy to send from a link and 800 will never be hit from a transfer
            if(upgraderLinkEnergy < energyCap - 1){
                
                //if the link cannot be used, just continue
                if(currentEnergy  === 0 || currentCooldown > 0){
                    continue;
                }
                else{ 
                    
                    //if it can be used, transfer and break loop
                    currentLink.transferEnergy(upgraderLink);
					break;
                }
            }
        }
        
        
    }
    else{
        
        //set upgrader link into memory
        this.memory.upgraderLink = controller.pos.findClosestByRange(allLinks).id;
        console.log("Setting the upgrader link in memory successful: " + this.memory.upgraderLink);
    }

}
//------


/*
 * Run the links for the room
 */
Room.prototype.runTerminal = function() {

}
//------


/*
 * run all structures for the room (towers, terminals, links, etc)
 * purely functional, no return or params
 */
Room.prototype.runStructures = function(){

    //run towers for the room
    this.runTowers();

    //run links for the room
    if(this.memory.structures[STRUCTURE_LINK].length > 0)
	    this.runLinks();
    
    //run terminal for the room

}
//-------


//check if the room is owned by you
Room.prototype.isOwnedRoom = function () {
	
	//check if controller exists and if i own it
	if(this.controller != undefined && this.controller.my)
	{
		return true;
	}
	else
	{
		return false;
	}
	
}
//-----

//check if the room is owned by an ally
Room.prototype.isAllyRoom = function () {
	
	//checks if the room is friendly (owned by your or an ally)
	if(this.controller != undefined)
	{
		if(this.controller.owner === 'jakesboy2' || this.controller.owner === 'UhmBrock')
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}
//-----

//String read-write property Room.roomState
Object.defineProperty(Room.prototype, 'roomState', {
   
   get: function() {
       if (!this._roomState) {
           //this._roomState = #however you set roomState#;
       }
       return this._roomState;
       
   },
   set: function (value) {
       //Can do validation if needed
       this._roomState = value;
   }
   
});

//set room state to memory
Room.prototype.setRoomState = function () {

    /*
        TODO for room state overhaul
        Change spawn cost finder to use new states
        Change creep limits finder to use new states
        Change job queues to use new states (might be able to rework a little too)
        Add anything else you can think of here, this is gonna be a big project that will break
        stuff as its being worked on, so im not going to push until its completely done
        (or at least stable enough where you can assist with bug fixing)
        not going to get to this until this/next weekend tho so just setting the stage
        considering making global constants for the room states so they're easier to deal with tbh
        help me figure out how to do this please (i could look it up in 1 second but need you lol)
    */
    //right when we're starting a room out
    const INTRO = "ROOM_STATE_INTRO";

    //once creeps are established, but no containers and stuff, early game
    const BEGINNER = "ROOM_STATE_BEGINNER";

    //pre-storage, but we're good to go with miners and stuff
    const INTERMEDIATE = "ROOM_STATE_INTERMEDIATE";

    //post storage economy, pre upgrader
    const ADVANCED = "ROOM_STATE_ADVANCED";

    //named this powerhouse because our powerUpgrader is an absolute unit
    //power upgrading is being used
    const POWERHOUSE = "ROOM_STATE_POWERHOUSE";

    //end game for the room, level 8 controller
    const END = "ROOM_STATE_END";

    var roomState;

    var numContainers = this.memory.structures[STRUCTURE_CONTAINER].length;
    var numLinks = this.memory.structures[STRUCTURE_LINK].length;
    var energy = this.energyCapacityAvailable;
    var storage = this.storage;
    var numCreepsInRoom = this.memory.creepsInRoom.length;

    //check if containers exist -----
    if(numCreepsInRoom >= 3 && numContainers > 0)
    {
        if (storage && numCreepsInRoom >= 6) {

            //storage and plenty o creeps
            roomState = ADVANCED;
        }
        else {

            //containers exist, but no storage or not enough creeps to support it
            roomState = INTERMEDIATE;
        }
    }
    else if (numCreepsInRoom >= 3) {
        
        //if we have no containers, but over or at 3 creeps, beginner
        roomState = BEGINNER;
    }
    else {

        //no containers, and less than 3 creeps
        roomState = INTRO;
    }
    //-------

    //put the roomstate into the room's memory
    this.memory.roomState = roomState;
}
//------

//string-array read-only property Room.structures
Object.defineProperty(Room.prototype, 'structures', {
    
    get: function() {
        
        if(!this.memory.structures){
            this.getStructures();
        }
        
        let returnArray = [];
    
        _.forEach(this.memory.structures, function(structFolder) {
            
           _.forEach(structFolder, structID => returnArray.push(Game.getObjectById(structID))); 
           
        });
        
        return returnArray;
    }

});

//gets all the structures in the room as objects
Room.prototype.getStructureObjects = function() {
    
    let returnArray = [];
    
    _.forEach(this.memory.structures, function(structFolder) {
        
       _.forEach(structFolder, structID => returnArray.push(Game.getObjectById(structID))); 
       
    });
    
    return returnArray;
    
}
