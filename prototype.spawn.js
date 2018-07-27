//Create creep functions for each role

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
StructureSpawn.prototype.createHarvester = function (homeRoom, energyCost) {
	
	//random num for name
	var rand = Game.time.toString();
	var body = [];

	//harvester body, 2 works subtract 200 from energy
	body = [WORK, WORK];
	energyCost -= 200;

	//get max parts of the remaining energy
	var maxParts = Math.floor(energy/100);

	//loop through and add carry and move parts
	for(let i = 0; i < maxParts; ++i)
	{
		body.push(CARRY);
		body.push(MOVE);
	}

	//create the creep
	this.spawnCreep(body, 'harvester - ' + rand, { memory: {
		role: 'harvester',
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
	var rand = Game.time.toString();
	var body = [];

	//create proper amount of work parts and subtract energy based on available energy
	if(energy < 550)
	{
		body = [WORK, WORK];
		energyCost -= 200;
	}
	else if(energyCost < 800)
	{
	    body = [WORK, WORK, WORK];
	    energyCost -= 300;
	}
    else if(energyCost < 1100)
	{
        body = [WORK, WORK, WORK, WORK];
        energyCost -= 400;
    }
    else
	{
        body = [WORK, WORK, WORK, WORK, WORK, WORK, WORK];
        energyCost -= 700;
    }

	//get number of carry and move parts possible
	var maxParts = Math.floor(energy / 100);
    
    //loop through and add carry and move parts the remaining allowed amount
    for(let i = 0; i < maxParts; ++i){
        body.push(CARRY);
        body.push(MOVE);
    }

	//create the creep
	this.spawnCreep(body, 'worker - ' + rand, { memory: {
		role: 'worker',
		homeRoom: homeRoom,
		state: 'STATE_SPAWNING',
		workTarget: null
	}});
	
}
//----
