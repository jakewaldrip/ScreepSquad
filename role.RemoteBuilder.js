'use strict';


module.exports = {
    run: function(creep) {


        //check if we need to flee before doing anything
        //creep.checkToFlee()
        if ( creep.needToFlee() ) {
            creep.memory.state = 'STATE_FLEE';
        }
        //-------------


		//check the state and act appropirately
		switch(creep.state)
		{
			case 'STATE_SPAWNING':

                if(!creep.spawning){
                    //get target
                    //switch states
                }

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
            
			default: 

				console.log("Invalid creep state for " + creep.name);

			break;
		}
    }
    //---------------------
};