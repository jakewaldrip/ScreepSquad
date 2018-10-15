/** @namespace Creep_Military */


/**
 * get a target and state upon spawning for military creep
 * @params {Object} options
 **/
Creep.prototype.runSpawningMili = function(options) {
    
    //check if we're spawning and do nothing
    //get a target and lets bounce if we're ready for action
    if(!this.spawning){
        this.getNextStateMili(options);
        this.getTargetMili(options);
    }
    
}


/**
 * run moving within the target room for a creep
 * @params {Object} options
 **/
Creep.prototype.runMovingDomesticMili = function(options) {
    
    var target = this.memory.options['attackTarget'];
    
    //if the creep can reach its target
    if(this.canReachMili(options)){
        
        //go to the next state
        this.getNextStateMili(options);
    }
    else{ //if the creep cannot reach its target
        
        //move to that target
        this.travelTo(target);
    }
}


/**
 * run moving if the creep isn't in the correct room
 * @params {Object} options
 **/
Creep.prototype.runMovingRemoteMili = function(options) {
    
    var homeRoom = this.memory.homeRoom;
    var targetRoom = this.memory.options['targetRoom'];
    var currentRoomName = this.room.name;
    
    
    //if the creep is in the correct room
    if(currentRoomName === targetRoom.name){
        
        //get a target and change to the next proper state
        this.getNextStateMili(options);
        this.getTargetMili(options);
    }
    else{ //if the creep is in the wrong room
        
        //move to the correct room
        this.travelTo(targetRoom, {allowHostile: true});
    }
}


/**
 * attack the target with vegence, and make sure target is still ideal
 * @params {Object} options
 **/
Creep.prototype.runAttackingMili = function(options) {
    
    //check if we are in range of the target
    //attack it
    //change state if we need to attack heal or flee
    
}


/**
 * wait in the room for a threat to appear, and respond accordingly
 * @params {Object} options
 **/
Creep.prototype.runDefendingMili = function(options) {
    
    //check for enemy creeps in the room, target them and change states if found
    //keep guard if not found
}


/**
 * called BEFORE getting the proper state
 * get the next state for a military creep
 * @params {Object} options
 **/
Creep.prototype.getNextStateMili = function(options) {
    
    //check what previous state was and options for creep
    //decide what they are supposed to do next
    
   var previousState = this.memory.state;
   var newState;
}


/**
 * called AFTER getting the proper state
 * get the target for the military creep
 * @params {Object} options
 **/
Creep.prototype.getTargetMili = function(options) {
    
    //this gets after before the next state, find a valid target
    var currentState = this.memory.state;
    
}


/**
 * let the creep chill at exit of home room until his squad has arrived
 * @params {Object} options
 **/
Creep.prototype.runRallyingMili = function(options) {
    
    //check if we are at the exit of the room
    //target it and move there if so
    //if there, wait for entire squad to be in this state
    //if entire squad is in this state, get next state
    
    var squadSize = this.memory.options['squadSize'];
}


/**
 * run from the threat until we are safe or healed up
 * @params {Object} options
 **/
Creep.prototype.runFleeingMili = function(options) {
    
    //run to the closest exit away from the threat
    //if our health goes back to full, get next state
    var health = this.creep.hits;
}


/**
 * checks if the creep is in range of the target
 * @params {Object} options
 * @params {String} the type of target we are dealing with
 **/
Creep.prototype.canReachMili = function(options, targetType) {
    
    //decide what the range is based on the options for the creep
    //for example, ranged creep can attack 2-3 away, melee can only attack 1
}


/**
 * kites the target, keeping the creep safe from harm
 * @params {Object} options
 **/
Creep.prototype.runKitingMili = function(options) {
    
    //check if we are in range of the target, wait/move to it if not
    //if its in our danger zone, move away and ranged attack
}