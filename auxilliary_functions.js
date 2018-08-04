	//converts ID's into objects
	//PARAMS: ID's
	//RETURNS: objects associated with ID's
var getObjectsFromIDArray = function (idArray) {

		let formattedObjects = {};

		_.forEach(idArray, o => formattedObjects[o.id] = o.amount) ;

		return formattedObjects;
}
//-------

String.prototype.capitalizeFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}    