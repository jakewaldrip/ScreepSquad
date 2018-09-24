'use strict';


module.exports = {
    run: function (creep) {

        
        //if no state, set state to spawning
        if (creep.state == undefined) {
            creep.state = 'STATE_SPAWNING';
        }
        //--------
        if(creep.memory.workTarget == null){
            creep.memory.workTarget = creep.room.memory.upgradeLink;
        }
        //check the state and act appropirately
        switch (creep.state) {
            case 'STATE_SPAWNING':

                creep.runSpawningDomestic();

                break;


            case 'STATE_MOVING':

                creep.runMovingDomestic();

                break;


            case 'STATE_USE_RESOURCES':

                creep.runUseResourcesUpgrader();

                break;


            case 'STATE_GET_RESOURCES':

                creep.runGetEnergyUpgrader();

                break;


            default:

                console.log("Invalid creep state for " + creep.name);

                break;
        }
    }
    //---------------------
};

