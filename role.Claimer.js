'use strict';


module.exports = {
    run: function(creep) {

		//check the state and act appropirately
		switch(creep.state)
		{
			case 'STATE_SPAWNING':
                
                if(!creep.spawning){
                    creep.memory.state = 'STATE_MOVING';
                }


			break;


			case 'STATE_MOVING':
                
                let destRoom = creep.memory.claimRoom;
                let currRoom = creep.room.name;
                        
                if(currRoom != destRoom)
                {
                    creep.travelTo(new RoomPosition(25, 25, destRoom));
                }
                else //currRoom == destRoom
                {
                    if(creep.pos.inRangeTo(creep.room.controller, 1)){
                        creep.memory.state = 'STATE_CLAIMING';
                        //might cause loop?
                        creep.run();
                    }
                    else{
                        creep.travelTo(creep.room.controller);
                    }
                }

			break;
            
            
            case 'STATE_CLAIMING':
                
                if(!creep.room.controller.my && creep.room.controller.owner == null)
                    creep.claimController(creep.room.controller);
                
                creep.memory.state = 'STATE_SIGNING';
                
            break;

            case 'STATE_SIGNING':
                
                if(!creep.memory.signed || creep.memory.signed == false){
                    creep.signController("ScreepSquad Turf");
                    creep.memory.signed = true;
                }
                
                //Change to either BLOCKING or RESERVING from here
                //to attack or supplement other rooms (prevent wasted TTL)

            break;
            
            case 'STATE_BLOCKING':
            
                //After you've claimed a room check for any flags signifying an attack on a room and go to that room to block controller
                
            break;
            
            case 'STATE_RESERVING':
            
                //Might change into a reserver, or it might just supplement a reserved room
            
            break;
            
            
			default: 

				console.log("Invalid creep state for " + creep.name);

			break;
		}
    }
    //---------------------
};
