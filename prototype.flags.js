'use strict';


//sets the flag into a room memory based on the closest owned room to it
Flag.prototype.assignRemoteFlagToRoom = function () {
        
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