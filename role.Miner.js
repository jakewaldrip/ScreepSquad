'use strict';


module.exports = {
    run: function(creep) {

		//check the state and act appropirately
		switch(creep.state)
		{
			case 'STATE_SPAWNING':

                creep.runSpawningDomestic();

			break;


			case 'STATE_MOVING':

                creep.runMovingDomestic();

			break;


		    case 'STATE_HARVESTING':

                creep.harvest(Game.getObjectById(creep.workTarget));

			break;


			default: 

				console.log("Invalid creep state for " + creep.name);

			break;
		}
    }
    //---------------------
};
