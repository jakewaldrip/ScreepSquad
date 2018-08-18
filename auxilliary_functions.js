/** 
 * @namespace Aux_functions
 * @hideconstructor
 * @inheritdoc
*/

/**
 * Capitalizes the first letter of a string
 * @memberof Aux_functions
 * @return {string} 
 */
String.prototype.capitalizeFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}    

/**
 * Gets the object from an ID as a string
 * @memberof Aux_functions
 * @return {Object}
 */
String.prototype.getObjects = function(){
    
    return Game.getObjectById(this);
    
}

/**
 * Gets the objects from an array of ID strings
 * @memberof Aux_functions
 * @extends String
 * @return {Object[]}
 */
Array.prototype.getObjects = function() {
    let objectArray = [];
    
    for(i = 0; i < this.length; i++){
        
        objectArray[i] = Game.getObjectById(this[i]);
        
    }
    
    return objectArray;
}
