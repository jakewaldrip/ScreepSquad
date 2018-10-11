'use strict';


module.exports = {
    run: function(creep) {

		//check the state and act appropirately
		switch(creep.state)
		{
			case 'STATE_SPAWNING':

                if(!creep.spawning){
                    creep.state = 'STATE_MOVING'
                }

			break;


			case 'STATE_MOVING':

                let destRoom = creep.memory.dependentRoom;
                let currRoom = creep.room.name;
                        
                if(currRoom != destRoom)
                {
                    creep.travelTo(new RoomPosition(25, 25, destRoom));
                }
                else //currRoom == destRoom
                {
                    let target = Game.getObjectById(creep.memory.workTarget);
                    
                    //Get a target
                    if(target == null){
                        //If creep has energy
                        if(creep.Full || !creep.Empty){
                            //Get work target
                            //if creep.canReach(target)
                                //switch to 'STATE_USE_ENERGY'
                        }
                        else
                        {
                            //Get energy target(source)
                            //if creep.canReach(target)
                                //switch to 'STATE_GET_ENERGY'
                        }
                        
                        //travel to get away from exit
                        target = Game.getObjectById(creep.memory.workTarget);
                        creep.travelTo(target);
                        
                    }
                    else{
                        
                        //If creep has energy
                        if(creep.Full || !creep.Empty){
                            //if creep.canReach(target)
                                //switch to 'STATE_USE_ENERGY'
                            //else
                                //travelTo target
                        }
                        else
                        {
                            //if creep.canReach(target)
                                //switch to 'STATE_GET_ENERGY'
                            //else
                                //travelTo target
                        }
                        
                    }
                    
                }

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