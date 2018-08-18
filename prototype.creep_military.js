/** @namespace Creep_Military */

Creep.prototype.runSpawningMilitary = function() {
    
    //Spawning Code Here
    
}

Creep.prototype.runMovingMilitary = function() {
    
    //Moving code here
    //ONLY moving to target room/flag initially
    //special movements like kiting or attacking will be handled inside the creep method
    
}

Creep.prototype.runAttackingMilitary = function() {
    
    //Attacking and staying in range code here
    //Will probably handle healing as well
    
}

Creep.prototype.runRangedAttackingMilitary = function() {
    
    //Handle kiting and ranged attacks/healing here
    
}

Creep.prototype.runDefendingMilitary = function() {
    
    //Handle idling/grouping in a room here
    
}

Creep.prototype.getMilitaryTarget = function() {
    
    //Probably check memory for dedicated target
    //and then moveTo it using moveState?
    
}