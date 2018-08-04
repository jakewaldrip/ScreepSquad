
//set defcon level for the room (danger!!!)
Room.prototype.setDefconLevel = function () {

	//check if enemy creeps exist
	//check if they have any boosted body parts
	//check the number of total body parts
	//check if a nuke is inbound
	//cry
}
//-------


//find target for the towers to target lol
Room.prototype.findTowerTarget = function () {

	//check defcon level to decide if we need to attack
	//check if any friendly creeps require healing
	//check if any structures need repairing
}
//--------


//run the logic for the towers
Room.prototype.runRoomTowers = function () {

	//find the target for the tower
	let target = this.findTowerTarget();

	//get all the towers in the room
	let towerID = this.structures['STRUCTURE_TOWER'];
	let towers = aux_functions.getObjectsFromIDArray(towerID);

	//run runTower for each tower if a target exists
	if (target != undefined)
	{
		_.forEach(towers, tower => tower.runTower(target));
	}	
}
//--------


//run an individual tower
StructureTower.prototype.runTower = function () {

	//if target is an enemy creep, attack it
	//if target is a friendly creep, heal it
	//if target is a structure, repair it
}
//---------