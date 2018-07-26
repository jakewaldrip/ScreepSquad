//Aux Functions for Room object

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


//set room state to memory
Room.prototype.setRoomState = function () {
	
}
//------

//Create a property - Room.structures.
//Almost exactly the same as Room.prototype.getStructureObjects();
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