'use strict';


module.exports = {
    run: function(creep) {

		//check the state and act appropirately
		switch(creep.state)
		{
			case 'STATE_SPAWNING':

                creep.runSpawningMilitary();

			break;


			case 'STATE_MOVING':

                creep.runMovingMilitary();

			break;


		    case 'STATE_ATTACKING':

                creep.runAttackingMilitary();

			break;

            case 'STATE_RANGED_ATTACKING':
                
                creep.runRangedAttackingMilitary();
                
            break;

            case 'STATE_DEFENDING':

                creep.runDefendingMilitary();

            break;

			default: 

				console.log("Invalid creep state for " + creep.name);

			break;
		}
    }
    //---------------------
};