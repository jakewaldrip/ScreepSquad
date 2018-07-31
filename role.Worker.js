'use strict';


module.exports = {
    run: function(creep) {
		
		//if no state, set state to spawning
		if(creep.state == undefined)
		{
			creep.state = 'STATE_SPAWNING';
		}
		//--------


		//check the state and act appropirately
		switch(creep.state)
		{
			case 'STATE_SPAWNING':

				creep.runSpawningDomestic();

			break;


			case 'STATE_MOVING':

				creep.runMovingDomestic();

			break;


		    case 'STATE_USE_RESOURCES':

				creep.runWorkDomestic();

			break;


			case 'STATE_GET_RESOURCES':

				creep.runHarvestingDomestic();

			break;


			default: 

				console.log("Invalid creep state for " + creep.name);

			break;
		}
    }
    //---------------------
};
