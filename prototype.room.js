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
	
    //add 2 states, end state, and power upgrader state (names up for debate)
    //power upgrader state is 2300 energy + 3 links
    //end state is lvl 8, changes power upgrader
    //possibly 1 other state for a full time supporting room, or just lump together with end state?
    //possibly a state/something that tags a room as a military outpost if its main purpose is
    //attacking other rooms as a forward base, but not sure what we would perform differently in the room
    //if this happened to be the case

    var containers = this.memory.structures[STRUCTURE_CONTAINER];

    //check if containers exist
    if(this.memory.creepsInRoom.length >= 3 && containers.length > 0)
    {
        if(this.storage && this.memory.creepsInRoom.length >= 6)
        {
            this.memory.roomState = "ROOM_STATE_ADVANCED";
        }
        else
        {
            this.memory.roomState = "ROOM_STATE_INTERMEDIATE";
        }
    }
    else if(this.memory.creepsInRoom.length >= 3)
    {
        this.memory.roomState = "ROOM_STATE_BEGINNER";
    }
    else{
        this.memory.roomState = "ROOM_STATE_INTRO";
    }
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
