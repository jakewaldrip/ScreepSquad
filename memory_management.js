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
				 
				 if(Memory.overseers[room])
				    delete Memory.overseers[room];

			  }
			  else{
			      //if it exists, delete stale data
			      Memory.rooms[room].jobQueues = {};
			  }
		  }
		  
      }
      //------------------
};
