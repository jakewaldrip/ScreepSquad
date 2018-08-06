Room.prototype.runTowers = function() {
    
    let towers = _.map(this.memory.structures[STRUCTURE_TOWER], id => Game.getObjectById(id));
    
    _.forEach(towers, tower => tower.run());
    
}

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
	
    var containers = this.memory.structures[STRUCTURE_CONTAINER];

    //check if containers exist
    if(containers != undefined && containers.length > 0)
    {
        if(this.storage)
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
//object-array read-only property Room.jobQueues
Object.defineProperty(Room.prototype, 'jobQueues', {
    
    get: function() {
        if(!this.memory.jobQueues){
            this.getJobQueues();
        }
        
        return this.memory.jobQueues;
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