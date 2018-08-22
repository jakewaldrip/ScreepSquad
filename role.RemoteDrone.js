'use strict';


module.exports = {
    run: function(creep) {


        //check if we need to flee before doing anything
        if (creep.memory.remoteRoom.defcon > 0) {
            creep.memory.state = 'STATE_FLEE';
        }
        //-------------


		//check the state and act appropirately
		switch(creep.state)
		{
			case 'STATE_SPAWNING':

                creep.runSpawningRemote();

			break;


			case 'STATE_MOVING':

                creep.runMovingRemote();

			break;


		    case 'STATE_GET_RESOURCES':

                creep.runGetEnergyRemote();

			break;


            case 'STATE_USE_RESOURCES':

                creep.runUseEnergyRemote();

            break;


		    case 'STATE_FLEE':

		        creep.runRemoteFlee();

		    break;


			default: 

				console.log("Invalid creep state for " + creep.name);

			break;
		}
    }
    //---------------------
};