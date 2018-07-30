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

                let target = Game.getObjectById(creep.workTarget);
                let result = creep.harvest(target);
                if(result == ERR_NOT_IN_RANGE){
                    creep.moveTo(target, { reusePath: 15 });
                }
                else if(result == OK){
                    creep.state = "STATE_HARVESTING";
                }

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
