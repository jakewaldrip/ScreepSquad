//Capitalizes the first letter of a string
//Used in call functions
String.prototype.capitalizeFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}    

//Gets the object from an ID
//"override" of Array.getObjects in case array is only a single string
String.prototype.getObjects = function(){
    
    return Game.getObjectById(this);
    
}

//Gets the objects from an array of IDs
//returns an array
Array.prototype.getObjects = function() {
    let objectArray = [];
    
    for(i = 0; i < this.length; i++){
        
        objectArray[i] = Game.getObjectById(this[i]);
        
    }
    
    return objectArray;
}