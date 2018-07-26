module.exports = {

	//converts ID's into objects
	//PARAMS: ID's
	//RETURNS: objects associated with ID's
	getObjectsFromIDArray: function (idArray)
	{
		let formattedObjects = {};

		_.forEach(idArray, o => formattedObjects[o.id] = o.amount) ;

		return formattedObjects;
	}
	//-------

    
};
