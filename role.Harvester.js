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



			break;


			case 'STATE_MOVING':



			break;


			case 'STATE_HARVESTING':



			break;


			case 'STATE_USE_RESOURCES':



			break;


			default: 

				console.log("Invalid creep state for " + creep.name);

			break;
		}
    }
    //---------------------
};
