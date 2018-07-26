
/*
Room.prototype.getData = {
    
    room: this,
  */  
Room.prototype.getData = function () {
        
        if(!this.memory){
            Memory.rooms[room.name] = {};
        }
        
        /****************************/
        /* Functions performed once */
        /****************************/
        
        this.getSources();
        
        /**********************************/
        /* Functions performed every tick */
        /**********************************/
        
        this.getStructures();
        
        this.getConstructionSites();
        
        this.getDroppedEnergy();
        
    }
    
    
    
Room.prototype.getSources = function () {
        
        if(!this.memory.sources){
            
            
            let roomSources = this.find(FIND_SOURCES);
            
            let formattedSources = {};
            
            let room = this;
            
            _.forEach(roomSources, function(source) {
                
                formattedSources[source.id] = {};
                
                let adjacentTiles = room.lookForAtArea(LOOK_TERRAIN, source.pos.y -1, source.pos.x -1, 
                                                                     source.pos.y +1, source.pos.x + 1, true)
                
                let walkableTiles = _.filter(adjacentTiles, t => t.terrain != "wall");
                
                formattedSources[source.id]["accessTiles"] = _.map(walkableTiles, tile => [tile.x, tile.y]);
                
            });
            
            this.memory.sources = formattedSources;
            
        }
    }
    
    
    
Room.prototype.getStructures = function () {
        
        
        
        const structuresConstants = {
            STRUCTURE_ROAD, STRUCTURE_EXTENSION, STRUCTURE_WALL,
            STRUCTURE_RAMPART, STRUCTURE_SPAWN, STRUCTURE_KEEPER_LAIR,
            STRUCTURE_PORTAL, STRUCTURE_CONTROLLER, STRUCTURE_LINK,
            STRUCTURE_STORAGE, STRUCTURE_TOWER, STRUCTURE_POWER_BANK,
            STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_EXTRACTOR,
            STRUCTURE_LAB, STRUCTURE_TERMINAL, STRUCTURE_NUKER,
            STRUCTURE_CONTAINER
        }
        
        let sortedStructures = {};
        
        let roomStructures = this.find(FIND_STRUCTURES);
        
        _.forEach(structuresConstants, function(constant) {
            sortedStructures[constant] = _.map(_.remove(roomStructures, s => s.structureType == constant), o => o.id);
        });
        
        this.memory.structures = sortedStructures;
        
        
        
    }
    
    
    
Room.prototype.getConstructionSites = function () {
        
        
        
        let roomConstructionSites = _.filter(Game.constructionSites, cs => cs.pos.roomName == this.name);
        
        this.memory.constructionSites = _.map(roomConstructionSites, cs => cs.id);
        
        
    }
    
    
    
Room.prototype.getDroppedEnergy = function () {
        
        
        
        let roomDrops = this.find(FIND_DROPPED_RESOURCES, { 
            filter: { resourceType: RESOURCE_ENERGY } });
        
        
        let formattedDrops = {};
        
        _.forEach(roomDrops, de => formattedDrops[de.id] = de.amount );
        
        this.memory.droppedEnergy = formattedDrops;
        
        
            
    }


Room.prototype.getRepairTargets = function () {
	
	//get all objects that need to be repaired in the Room
	var repairTargets = this.find(FIND_STRUCTURES, {
            filter: (s) => (s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)
            && s.hits < s.hitsMax
	});

	let formattedTargets = {};

	_.forEach(repairTargets, rd => formattedTargets[rd.id] = rd.amount) ;

	this.memory.repairTarget =  formattedTargets;
}
    