	//converts ID's into objects
	//PARAMS: ID's
	//RETURNS: objects associated with ID's
var getObjectsFromIDArray = function (idArray) {

		let formattedObjects = {};
        
        //still don't get why this does "o => o.amount"
		_.forEach(idArray, o => formattedObjects[o.id] = o.amount) ;

		return formattedObjects;
}
//-------

String.prototype.capitalizeFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}    

Array.prototype.getObjects = function() {
    
    let objectArray = [];
    
    for(i = 0; i < this.length; i++){
        
        if(this[i] instanceof String){
            
            objectArray[i] = Game.getObjectById(this[i]);
            
        }
        
    }
    
}