//Aux Functions for Room object

//check if the room is owned by you
Room.prototype.isOwnedRoom = function () {

}
//-----


//check if the room is owned by an ally
Room.prototype.isAllyRoom = function () {

}
//-----


//set room state to memory
Room.prototype.setRoomState = function () {

}
//------

//get structure objects from memory
Room.prototype.getStructureObjects = function() {
    
    let returnArray = [];
    
    _.forEach(this.memory.structures, function(structFolder) {
        
       _.forEach(structFolder, structID => returnArray.push(Game.getObjectById(structID))); 
       
    });
    
    return returnArray;
    
}
