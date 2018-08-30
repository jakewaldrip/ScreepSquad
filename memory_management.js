/** @namespace memory_management */
module.exports = {

	  //creates function to clear up memory
	garbageCollection: function()
    {

	  	//loop through creep names
	 	for (let name in Memory.creeps) 
		{
			 //and check if the creep is still alive
			 if (Game.creeps[name] == undefined) 
			 {
				//if not, delete the memory entry
				delete Memory.creeps[name];
			 }
		}

		//loop over rooms
		for(let room in Memory.rooms)
		{
			//and check if room exists
			if(Game.rooms[room] == undefined)
			{
				//if not, delete the memory entry
				delete Memory.rooms[room];

			}
			else
			{
				//if it exists, delete stale data
				Memory.rooms[room].jobQueues = {};
				Memory.rooms[room].creepCounts = {};
			}
		}

    },
    //--------------
	
    deadFlagCleaning: function()
    {
    	//check for any remote, claim, attack, etc rooms that do not have a live flag
		//delete this rooms from the main room's memory
		var ownedRooms = _.filter(Game.rooms, r => r.isOwnedRoom() == true);
		let currentRoom;
		let currentRemoteRoom;
		
		//get all flags of each type
		var flags = Game.flags;
		var remoteFlags = _.filter(Game.flags, f => f.color === COLOR_YELLOW && f.secondaryColor === COLOR_YELLOW);
		var claimFlags = _.filter(Game.flags, f => f.color === COLOR_WHITE && f.secondaryColor === COLOR_WHITE);
		var attackFlags = _.filter(Game.flags, f => f.color === COLOR_RED && f.secondaryColor === COLOR_RED);

		//loop over remote rooms for each room and remove any that does not have a live remote flag
		_.forEach(ownedRooms, function(currentRoom) {
			
			//loop over remote rooms for this specific room
			_.forEach(currentRoom.memory.remoteRooms, function(remoteRoom) {
				
				//check if this assigned remote room has a live flag, if not, delete it
				if(!_.some(remoteFlags, rf => rf.pos.roomName === remoteRoom["name"]))
				{
					delete currentRoom.memory.remoteRooms[remoteRoom.name];
					console.log("Remote room deleted from room " + currentRoom.name);
				}
			});
			
			//loop over claim rooms for this specific room
			_.forEach(currentRoom.memory.claimRooms, function(claimRoom) {
			    
			    if(!_.some(claimFlags, cf => cf.pos.roomName === claimRoom["name"]))
			    {
			        delete currentRoom.memory.claimRooms[claimRoom.name];
			        console.log("Claim room deleted from room " + currentRoom.name);
			    }
			});
			
		});
		
	}
	//------------
}