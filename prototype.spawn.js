//Create creep functions for each role
StructureSpawn.prototype.createRole = function (homeRoom, energyCost, role){
    var roleFunction = {
        miner: this.createMiner,
        
        drone: this.createDrone,
        
        worker: this.createWorker
    };
    
    if(roleFunction.hasOwnProperty(role)){
        console.log(`${this.name} is hatching a ${role}!`);
        roleFunction[role].call(this, homeRoom, energyCost);
    }
        
}
//create miner
//PARAMS: homeRoom, energyCost
StructureSpawn.prototype.createMiner = function (homeRoom, energyCost) {
	//random num for name
	var name = 'miner - ' + Game.time.toString();
	var body = [];
	
    let w = 0, m = 0, c = 0;
    if(energyCost >= 700){
        w = 5;
        m = 3;
        c = 1;
    }
    else{
        let x = Math.floor(energyCost / 250);
    	
	    w = 2 * x;
	    m = 1 * x;
	    
    }
    	body = _.times(w, () => WORK);
    	body = body.concat(_.times(m, () => MOVE) );
        body = body.concat(_.times(c, () => CARRY));
    
	//create the creep
	this.spawnCreep(body, name, { memory: {
		role: 'miner',
		homeRoom: homeRoom,
		state: 'STATE_SPAWNING',
		workTarget: null
	}});
	
}
//----


//create harvester
//PARAMS: homeRoom, energyCost
StructureSpawn.prototype.createDrone = function (homeRoom, energyCost) {
	
	//random num for name
	var name = 'drone - ' + Game.time.toString();
	var body = [];
    
    let w = 0, c = 0, m = 0;
	//harvester body, 2 works subtract 200 from energy
	w += 2;
	energyCost -= 200;

	//get max parts of the remaining energy
	var maxParts = Math.floor(energyCost/100);
    
    c += maxParts;
    m += maxParts;

    body = _.times(w, () => WORK);
	body = body.concat(_.times(m, () => MOVE) );
    body = body.concat(_.times(c, () => CARRY));
    
	//create the creep
	this.spawnCreep(body, name, { memory: {
		role: 'drone',
		homeRoom: homeRoom,
		state: 'STATE_SPAWNING',
		workTarget: null
	}});
	
}
//----


//create worker
//PARAMS: homeRoom, energyCost
StructureSpawn.prototype.createWorker = function (homeRoom, energyCost) {
	
	//random num for name
	var name = 'worker - ' + Game.time.toString();
	var body = [];
    
    let w = 0, m = 0, c = 0;
	//create proper amount of work parts and subtract energy based on available energy
	if(energyCost < 550 && energyCost >= 200)
	{
		w += 2;
		energyCost -= 200;
	}
	else if(energyCost < 800)
	{
	    w += 3;
	    energyCost -= 300;
	}
    else if(energyCost < 1100)
	{
        w += 4;
        energyCost -= 400;
    }
    else
	{
        w += 7;
        energyCost -= 700;
    }

	//get number of carry and move parts possible
	var maxParts = Math.floor(energyCost / 100);
    
    c += maxParts;
    m += maxParts;

    body = _.times(w, () => WORK);
	body = body.concat(_.times(m, () => MOVE) );
    body = body.concat(_.times(c, () => CARRY));
    
	//create the creep
	this.spawnCreep(body, name, { memory: {
		role: 'worker',
		homeRoom: homeRoom,
		state: 'STATE_SPAWNING',
		workTarget: null
	}});
	
}
//----


//create remote miner
StructureSpawn.prototype.createRemoteMiner = function(homeRoom, remoteRoom, energyCost)
{

}
//-----


//create remote drone
StructureSpawn.prototype.createRemoteDrone = function(homeRoom, remoteRoom, energyCost)
{

}
//-----


//create reserver
StructureSpawn.prototype.createReserver= function(homeRoom, remoteRoom, energyCost)
{

}
//-----

//create claimer
StructureSpawn.prototype.createReserver= function(homeRoom, remoteRoom, energyCost)
{
    
}
//------
