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
}

Creep.prototype.runAttackingMilitary = function() {
    
    //Attacking and staying in range code here
    //Will probably handle healing as well
    let target = Game.getObjectById(this.memory.workTarget);
    
    if(target == null){
        this.getMilitaryTarget();
        this.heal(this);
    }
    
    else if(this.hits < this.hitsMax/2){
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
    let target;
    let homeRoom = Game.rooms[this.memory.homeRoom];
    
    //Filter homeRoom's creepsInRoom for creeps in the current room with low HP
    let lowCreeps = _.map(homeRoom.memory.creepsInRoom, name => Game.creeps[name]);
    lowCreeps = _.filter(lowCreeps, creep => creep.room.name == this.room.name, this);
    lowCreeps = _.filter(lowCreeps, creep => creep.hits < creep.hitsMax);
    
    //finds the creep with the most missing HP
    target = _.max(lowCreeps, creep => creep.hitsMax - creep.hits);
    
    if(this.rangedHeal(target) == ERR_NOT_IN_RANGE){
        
        //temporary extension of range
        let moveOpts = this.moveOpts();
        moveOpts["range"] = 3;
        
        this.moveTo(target, moveOpts);
    }
    //Creep should heal itself
    //Creep should also heal any low miners/drones/reservers in room
    //Maybe should be looking to see if any remoteRooms in other areas need protected?
    //Since that would probably prevent some issues with spawning where this room has 0 Defcon now,
    // but the other room raised limit to 1 remoteDefender, which is idling in the 0 defcon room.
    
}

Creep.prototype.getNextStateMilitary = function() {
    
    let creepParts = this.body;
                
    let attackParts = _.remove(creepParts, part => part.type == ATTACK).length;
    let rangedParts = _.remove(creepParts, part => part.type == RANGED_ATTACK).length;
    
    let enemyCount = this.room.memory.enemies.combatCreeps.length + this.room.memory.enemies.healCreeps.length + this.room.memory.enemies.otherCreeps.length;
    
    if(rangedParts > 0 && enemyCount > 0){
        this.memory.state = "STATE_RANGED_ATTACKING";
    }
    else if(attackParts > 0 && enemyCount > 0){
        this.memory.state = "STATE_ATTACKING";
    }
    else{
        this.memory.state = "STATE_DEFENDING";
    }
}

Creep.prototype.getMilitaryTarget = function() {
    
    this.memory.workTarget = null;
    
    if(this.room.name != this.memory.defenseRoom){
        //Places the properties of a RoomPosition target in memory instead
        this.workTarget = {x: 25, y: 25, roomName: this.memory.defenseRoom};
        this.state = 'STATE_MOVING';
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
            this.state = 'STATE_MOVING';
        }
        else{
            this.getNextStateMilitary();
            //Temporary code to keep it full hp when idle
            //Will eventually be done in STATE_DEFENDING
            this.heal(this);
            //not sure what to do to make it defend here
            this.say("Run Boys!")
            
        }
    }
    //Probably check memory for dedicated target
    //and then moveTo it using moveState?
    
}