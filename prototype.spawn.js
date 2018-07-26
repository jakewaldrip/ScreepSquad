//Create creep functions for each role

//create miner
//PARAMS: homeRoom, energyCost
StructureSpawn.prototype.createMiner = function (homeRoom, energyCost) {
	
	//random num for name
	var rand = Game.time.toString();
	var body = [];

	//550 energy (first available miner)
	//4 work, 2 move, 1 carry
	if(energyCost > 550)
	{
		body = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
	}
	else
	{
		//anything above 550, 5 work, 3 move, 1 carry (700 energy)
		body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY];
	}

	//create the creep
	this.spawnCreep(body, 'miner - ' + rand, { memory: {
		role: 'miner',
		homeRoom: homeRoom,
		state: 'STATE_SPAWNING',
		workTarget: 'none'
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
		workTarget: 'none'
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
		workTarget: 'none'
	}});
	
}
//----
