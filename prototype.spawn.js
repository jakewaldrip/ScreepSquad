
//just uses the last 4 digits of game time(greater than possible creep lifespan)
function randNum() { return Game.time.toString().slice(-4); }


//Create creep functions for each role
StructureSpawn.prototype.createRole = function (homeRoom, energyCost, role, dependentRoom){
    var roleFunction = {
	    
        miner: this.createMiner,
        
        drone: this.createDrone,
        
        worker: this.createWorker,
	
    };
	
	var remoteRoleFunction = {
		
	    remoteMiner: this.createRemoteMiner,
	    
	    remoteDrone: this.createRemoteDrone,
	    
	    remoteReserver: this.createRemoteReserver,
	    
	    claimer: this.createClaimer
		
	};
    
    //spawn domestic creeps
    if(roleFunction.hasOwnProperty(role)){
        console.log(`${this.name} is hatching a ${role}!`);
        roleFunction[role].call(this, homeRoom, energyCost);
    }
	
    //spawn remote creeps
    if(remoteRoleFunction.hasOwnProperty(role))
    {
    	console.log(`${this.name} is hatching a ${role}!`);
	remoteRoleFunction[role].call(this, homeRoom, energyCost, dependentRoom);
    }
        
}
//create miner
//PARAMS: homeRoom, energyCost
StructureSpawn.prototype.createMiner = function (homeRoom, energyCost) {
	//random num for name
	var name = 'miner - ' + randNum();
	var body = [];
	
    let w = 0, m = 0, c = 0;
    
    if(energyCost >= 650){
        w = 5;
        m = 3;
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
	var name = 'drone - ' + randNum();
	var body = [];
    
    let w = 0, c = 0, m = 0;
    if(energyCost == 200){
        c = 1; m = 1, w = 1;
    }
    else if(energyCost < 600){
        
        let x = Math.floor(energyCost / 250);
        
        w = 1 * x;
        m = 2 * x;
        c = 1 * x; 
        
    }
    else{   
    	//harvester body, 2 works subtract 200 from energy
    	w = 2; m = 1;
    	energyCost -= 250;
    
    	//get max parts of the remaining energy
    	let x = Math.floor(energyCost/150);
        
        c += 2 * x;
        m += 1 * x;
        
    }
    
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
	var name = 'worker - ' + randNum();
	var body = [];
    
    let w = 0, m = 0, c = 0;
	//create proper amount of work parts and subtract energy based on available energy
	if(energyCost < 600)
	{
		w++; m += 2; c++;
		energyCost -= 250;
	}
	else if(energyCost <= 800)
	{
	    w += 3; m += 3;
	    energyCost -= 450;
	}
    else if(energyCost <= 1300)
	{
        w += 6; m += 3;
        energyCost -= 750;
    }
    else
	{
        w += 8; m += 4;
        energyCost -= 1000;
    }

	//get number of carry and move parts possible
	if(this.room.memory.roomState == "ROOM_STATE_BEGINNER"){
	    
    	var x = Math.floor(energyCost / 100);
        
        c += 1 * x;
        m += 1 * x;
        
    }
    else{
        
        var x = Math.floor(energyCost / 150);
        
        c += 2 * x;
        m += 1 * x;
        
    }
    
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
//900 energy cap at inter + adv room state
StructureSpawn.prototype.createRemoteMiner = function(homeRoom, energyCost, dependentRoom)
{
	
    //random num for name
    var name = 'remoteMiner - ' + randNum();
    var body = [];
	
    let w = 0, c = 0, m = 0;
	
    //remote miners are static 6 work 6 move 1 carry
    w = 6;
    m = 7;
	c = 1;
	
    //create the body array with the numbers of each part
    body = _.times(w, () => WORK);
    body = body.concat(_.times(m, () => MOVE) );
	body = body.concat(_.times(c, () => CARRY) );
	
    //create the creep
    this.spawnCreep(body, name, { memory: {
    	role: 'remoteMiner',
    	homeRoom: homeRoom,
	remoteRoom: dependentRoom,
    	state: 'STATE_SPAWNING',
    	workTarget: null
    }});
}
//-----


//create remote drone
//1500 cap at inter room state
//2000 cap at adv room state
StructureSpawn.prototype.createRemoteDrone = function(homeRoom, energyCost, dependentRoom)
{
    //random num for name
    var name = 'remoteDrone - ' + randNum();
    var body = [];

    //default 2 work&move parts, subtract energy from total
    let w = 2, c = 0, m = 2;
    energyCost -= 300;

        
    let x = Math.floor(energyCost / 100);
        
    m += x
    c += x; 
 
    //create body array for creep given the parts
    body = _.times(w, () => WORK);
    body = body.concat(_.times(m, () => MOVE) );
    body = body.concat(_.times(c, () => CARRY));
        
    //create the creep
    this.spawnCreep(body, name, { memory: {
    	role: 'remoteDrone',
    	homeRoom: homeRoom,
	remoteRoom: dependentRoom,
    	state: 'STATE_SPAWNING',
    	workTarget: null
    }});
}
//----


//create reserver creep
//reserver  creep capped at 1400 energy
StructureSpawn.prototype.createRemoteReserver = function(homeRoom, energyCost, dependentRoom)
{
	
    //random num for name
    var name = 'reserver - ' + randNum();
    var body = [];
	
    let m = 0, cl = 0;
	
    cl = 2;
	m = 2;
	if(this.room.energyCapacityAvailable > 1500)
	    m += 3;
    //create body array for creep given the parts
    body = _.times(cl, () => CLAIM);
    body = body.concat(_.times(m, () => MOVE) );
	
    //create the creep
    this.spawnCreep(body, name, { memory: {
    	role: 'remoteReserver',
    	homeRoom: homeRoom,
	remoteRoom: dependentRoom,
    	state: 'STATE_SPAWNING',
    	workTarget: null
    }});
}
//-----


//create claimer creep
//claimer creep capped at 700 energy
StructureSpawn.prototype.createClaimer = function(homeRoom, energyCost, dependentRoom)
{
	
    //random num for name
    var name = 'claimer - ' + randNum();
    var body = [];
	
    let cl = 0, m = 0;
	
    cl = 1;
	m = 2;
    
    //create body array for creep given the parts
    body = _.times(cl, () => CLAIM);
    body = body.concat(_.times(m, () => MOVE) );
	
    //create the creep
    this.spawnCreep(body, name, { memory: {
    	role: 'remoteDrone',
    	homeRoom: homeRoom,
	claimRoom: dependentRoom,
    	state: 'STATE_SPAWNING',
    	workTarget: null
    }});
}
//-----
