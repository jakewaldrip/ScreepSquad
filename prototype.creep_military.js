/** @namespace Creep_Military */

Creep.prototype.runSpawningMilitary = function() {
    
    if(!this.spawning)
        this.getMilitaryTarget();
    
}

Creep.prototype.runMovingMilitary = function() {
    
    var target = this.workTarget;
    
    //checks if it's an object stored in memory and if it has an "x" property.
    //Should also check for y and roomName, but this should work for us w/o wasting CPU
    if(target instanceof Object && target.hasOwnProperty("x")){
        target = new RoomPosition(target.x, target.y, target.roomName);
    }
    else{
        target = Game.getObjectById(target);
    }
    
    if(target != null && target != undefined){
        
        if(target instanceof RoomPosition){
            //avoid getting stuck on exit tile
            this.moveTo(target, this.moveOpts() );
            if(this.room.name == target.roomName){
                
                this.getMilitaryTarget();
                
            }
            
        }
        else{
            
            this.getNextStateMilitary();
            
        }
    }
    else{
        
        this.getMilitaryTarget();
        
    }
    //Moving code here
    //ONLY moving to target room/flag initially
    //special movements like kiting or attacking will be handled inside the creep method
    
}

Creep.prototype.runAttackingMilitary = function() {
    
    //Attacking and staying in range code here
    //Will probably handle healing as well
    let target = Game.getObjectById(this.memory.workTarget);
    
    if(target == null){
        this.getMilitaryTarget();
        this.heal(this);
    }
    
    else if(this.attack(target) == ERR_NOT_IN_RANGE){
        this.moveTo(target, this.moveOpts() );
        //Worst case this will return a non-0 and change nothing, even if we dont' have parts
        this.heal(this);
    }
    
}

Creep.prototype.runRangedAttackingMilitary = function() {
    
    //Handle kiting and ranged attacks/healing here
    let target = Game.getObjectById(this.memory.workTarget);
    
    if(target == null){
        this.getMilitaryTarget();
        this.heal(this);
    }
    
    else if(this.rangedAttack(target) == ERR_NOT_IN_RANGE){
        
        //make it so range is 3 TEMPORARY
        let moveOpts = this.moveOpts();
        moveOpts["range"] = 3;
        
        this.moveTo(target, moveOpts);
        this.heal(this);
    }
    
    
}

Creep.prototype.runDefendingMilitary = function() {
    
    //Handle idling/grouping in a room here
    
    //Creep should heal itself
    //Creep should also heal any low miners/drones/reservers in room
    
}

Creep.prototype.getNextStateMilitary = function() {
    
    let creepParts = this.body;
                
    let attackParts = _.remove(creepParts, part => part.type == ATTACK).length;
    let rangedParts = _.remove(creepParts, part => part.type == RANGED_ATTACK).length;
    
    if(rangedParts > 0){
        this.memory.state = "STATE_RANGED_ATTACKING";
    }
    else if(attackParts > 0){
        this.memory.state = "STATE_ATTACKING";
    }
}

Creep.prototype.getMilitaryTarget = function() {
    
    this.memory.workTarget = null;
    
    if(this.room.name != this.memory.defenseRoom){
        //Places the properties of a RoomPosition target in memory instead
        this.workTarget = {x: 25, y: 25, roomName: this.memory.defenseRoom};
    }
    else{
        
        //However we decide a target here
        //TEMPORARY closest target by type 
        let homeRoom = Game.rooms[this.memory.homeRoom];
        
        let type;        
        
        if(this.room.memory.enemies.combatCreeps.length > 0){
            type = "combatCreeps";
        }
        
        else if(this.room.memory.enemies.healCreeps.length > 0){
            type = "healCreeps";
        }
        
        else if(this.room.memory.enemies.otherCreeps.length > 0){
            type = "otherCreeps";
        }
        
        if(type != undefined){
            let enemies = _.map(this.room.memory.enemies[type], id => Game.getObjectById(id));
            
            let closestEnemy = this.getClosest(enemies);
            
            //Choosing to use enemyCreep ID to keep syntax easy
            this.workTarget = closestEnemy.id;
             
        }
        else{
            //Temporary code to keep it full hp when idle
            //Will eventually be done in STATE_DEFENDING
            this.heal(this);
            //not sure what to do to make it defend here
            this.say("Run Boys!")
            
        }
    }
    
    this.state = 'STATE_MOVING';
    //Probably check memory for dedicated target
    //and then moveTo it using moveState?
    
}