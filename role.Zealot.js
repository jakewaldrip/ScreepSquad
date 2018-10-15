'use strict';


module.exports = {
    run: function(creep) {

        //options for the zealot role
        var options = {
            
             squad: true,
             attacker: true,
             healer: false,
             melee: true,
             ranged: false,
             guard: true,
             siege: false,
             dismantler: false
        }
        
		//check the state and act appropirately
		switch(creep.memory.state)
		{
			case 'STATE_SPAWNING':

                

			break;


			case 'STATE_MOVING':

               

			break;


		    case 'STATE_ATTACKING':

                

			break;


            case 'STATE_RALLYING':
                
                
                
            break;


            case 'STATE_FLEEING':
                
                
                
            break;
            
            
			default: 

				console.log("Invalid creep state for " + creep.name);

			break;
		}
    }
    //---------------------
};