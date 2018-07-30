'use strict';


module.exports = {
    run: function(creep) {
		
		var state;

		//if no state, set state to spawning
		if(creep.memory.state != undefined)
		{	
			state = creep.memory.state
		}
		else
		{
			creep.memory.state = 'STATE_SPAWNING';
			state = creep.memory.state;
		}
		//--------


		//check the state and act appropirately
		switch(state)
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



			break;


			default: 

				console.log("Invalid creep state for " + creep.name);

			break;
		}
    }
    //---------------------
};
