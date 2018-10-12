'use strict';


module.exports = {
    run: function(creep) {
        
        let target = Game.getObjectById(creep.memory.workTarget);
		//check the state and act appropirately
		switch(creep.state)
		{
			case 'STATE_SPAWNING':

                if(!creep.spawning){
                    creep.state = 'STATE_MOVING'
                    creep.run();
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
                    
                    //Get a target
                    if(target == null){
                        //If creep has energy
                        if(creep.Full || !creep.Empty){
                            let closestConstSite = creep.getClosest(creep.room.memory.constructionSites.getObjects());
                            
                            if(closestConstSite != null){
                                creep.memory.workTarget = closestConstSite.id;
                            }
                            else if(creep.room.controller.ticksToDowngrade < 5000)
                            {
                                creep.memory.workTarget = creep.room.controller.id;
                            }
                            else
                            {
                                if(creep.room.memory.structures && creep.room.memory.structures[STRUCTURE_SPAWN].length > 0){
                                    creep.memory.workTarget = creep.room.memory.structures[STRUCTURE_SPAWN][0];
                                }
                            }
                        }
                        else
                        {
                            let sources = Object.keys(creep.room.memory.sources).getObjects();
                            sources = _.filter(sources, source => source.energy > 0);
                            
                            if(sources.length > 0)
                                creep.memory.workTarget = creep.getClosest(sources).id;
                            
                        }
                        
                        //travel to get away from exit
                        target = Game.getObjectById(creep.memory.workTarget);
                        creep.travelTo(target);
                        
                    }
                    //already have a valid target
                    else{
                        
                        //If creep has energy
                        if(creep.Full || !creep.Empty){
                            if(creep.canReach(target))
                                creep.memory.state = 'STATE_USE_RESOURCES';
                            else
                                creep.travelTo(target);
                        }
                        else //creep does not have energy
                        {
                            if(creep.canReach(target))
                                creep.memory.state = 'STATE_GET_RESOURCES';
                            else
                                creep.travelTo(target);
                        }
                        
                    }
                    
                }

			break;


		    case 'STATE_GET_RESOURCES':
                
                if(!creep.Full){
                    creep.getEnergy(target);
                }
                else{
                    creep.memory.workTarget = null;
                    creep.memory.state = 'STATE_MOVING';
                }

			break;


            case 'STATE_USE_RESOURCES':
                
                if(!creep.Empty){
                    creep.useEnergy(target);
                }
                else{
                    creep.memory.workTarget = null;
                    creep.memory.state = 'STATE_MOVING';
                }

            break;
            
			default: 

				console.log("Invalid creep state for " + creep.name);

			break;
		}
    }
    //---------------------
};