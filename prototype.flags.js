'use strict';

//sets the flag into a room memory based on the closest owned room to it
Flag.prototype.assignRemoteFlagToRoom = function () {
    
    //loop through owned rooms and check if a this flag's room exists within its memory
    var flagRoom = this.pos.roomName;
    var ownedRooms = _.filter(Game.rooms, r => r.isOwnedRoom() == true)
    var isExist = false;
    let currentRoom;
    
    for(let room in ownedRooms)
    {   
        currentRoom = ownedRooms[room];
        var remoteRooms = currentRoom.memory.remoteRooms;
        
        //check if the flag is assigned to this room and trigger the isExist bool and break the loop
        if(_.some(remoteRooms, r => r == flagRoom))
        {
            isExist = true;
            break;
        }
    }
    
    let closestRoom = ownedRooms[0].name;
    let currentDistance;
    let previousDistance;

    //if flag is not assigned to a room, find closest room and assign it
    if(!isExist)
    {
        //loop over all rooms and flag the closest one
        for(let room in ownedRooms)
        {
            //get the distance between the flag room and the room we're checking
            //additionally, get distance between the current closest room and flag room
            currentDistance = Game.map.getRoomLinearDistance(flagRoom, ownedRooms[room].name);
            previousDistance = Game.map.getRoomLinearDistance(flagRoom, closestRoom);

            //check if this distance is less than the previous distance
            if(currentDistance < previousDistance)
            {
                closestRoom = ownedRooms[room].name;    
            }
        }

        //return the closest room to the remote room
        console.log("Remote Room added to room " + closestRoom);
        return closestRoom;
    }
	else
	{
		return null;
	}

		
}
//----------------


//sets claim flag to memory based on closest room to it
Flag.prototype.assignClaimFlagToRoom = function () {
    
}
//--------


//sets attack flag to memory based on closest room to it
Flag.prototype.assignAttackFlagToRoom = function () {
	
}
//------


Flag.prototype.assignFlagToRoom = function () {
	
	//if its double yellow, remote flags
        if(this.color === COLOR_YELLOW && this.secondaryColor === COLOR_YELLOW) {
            this.assignRemoteFlagToRoom();
        }

        //if its double white, claim flag
        if(this.color === COLOR_WHITE && this.secondaryColor === COLOR_WHITE) {
            this.assignClaimFlagToRoom();
        }

		//if its double red, attack flag
        if(this.color === COLOR_RED && this.secondaryColor === COLOR_RED) {
            this.assignAttackFlagToRoom();
        }
}
//-----
