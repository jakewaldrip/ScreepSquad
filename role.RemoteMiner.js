'use strict';


module.exports = {
    run: function(creep) {

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

                creep.runUseResourcesRemote();

            break;

			default: 

				console.log("Invalid creep state for " + creep.name);

			break;
		}
    }
    //---------------------
};
