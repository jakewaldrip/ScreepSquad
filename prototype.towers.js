
//set defcon level for the room (danger!!!)
Room.prototype.setDefconLevel = function () {

	//check if enemy creeps exist
	//check if they have any boosted body parts
	//check the number of total body parts
	//check if a nuke is inbound
	//cry
}
//-------

/*-------------------

Im converting your getJobqueue to get a single target
and plugging it into my findTowerTarget
(you cab do thjs if you want) 
the structure i have set up here keeps all tower and defense related things in one place 
and Overseer just calls one function to get to ball rolling 
Going to add a condition that none of thjs rben occurs unless we're lvel 3 also
-------------*/

//find target for the towers to target lol
Room.prototype.getTowerTarget = function() {
    
    let lowCreep, enemies, repairTargets;
    let target;
    
    lowCreep = _.map(this.memory.creepsInRoom, name => Game.creeps[name]);
    lowCreep = _.min(lowCreep, c => c.hits < c.hitsMax);
    if(lowCreep.hits < lowCreep.hitsMax)
        target = lowCreep;
    
    if(target == undefined){
        
        let type;        
        
        if(this.memory.enemies.combatCreeps.length > 0){
            type = "combatCreeps";
        }
        
        else if(this.memory.enemies.healCreeps.length > 0){
            type = "healCreeps";
        }
        
        else if(this.memory.enemies.otherCreeps.length > 0){
            type = "otherCreeps";
        }
        
        if(type != undefined){
            enemies = _.map(this.memory.enemies[type], id => Game.getObjectById(id));
            
            //finds closest enemy to the center of the room (Might change to controller, or spawn)
            target = _.min(enemies, enemy => enemy.pos.getRangeTo(25, 25)); 
        }
        
        if(target == undefined){
            
            repairTargets = _.map(Object.keys(this.memory.repairTargets), id => Game.getObjectById(id));
            //filter out targets less than 10% hp.
            repairTargets = _.filter(repairTargets, rt => this.memory.repairTargets[rt.id] <= .10, this);
            
            if(repairTargets.length > 0){
                target = _.min(repairTargets, rt => this.memory.repairTargets[rt.id], this);
            }
            
        }
    }
    //console.log(target);
    return target;
    
};

 //run the logic for the towers
 Room.prototype.runTowers = function () {

 	//find the target for the tower
 	let target = this.getTowerTarget();

 	//get all the towers in the room
 	let towerID = this.memory.structures[STRUCTURE_TOWER];
 	
 	let towers = towerID.getObjects();
 	
    //call run for each tower if a target exists
 	if (target != undefined)
 	{
 		_.forEach(towers, tower => tower.run(target));
 	}	
 }
 //--------


StructureTower.prototype.run = function(target) {
  
    let returnString = ERR_INVALID_TARGET;
    
    if(target instanceof Structure){
        returnString = this.repair(target);
    }
    else if(target instanceof Creep){
        
        if(target.my){
            returnString = this.heal(target);
        }
        else{
            returnString =  this.attack(target);
        }
    }
    
    return returnString;
};
