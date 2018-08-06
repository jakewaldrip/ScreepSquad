
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
        
        this.getRepairTargets();
	
	    this.getEnemyCreeps();
	    
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
                
                let accessTiles = [];
                
                _.forEach(walkableTiles, tile => accessTiles.push({x: tile.x, y: tile.y}) );
                
                formattedSources[source.id]["accessTiles"] = accessTiles;
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
	    
	    const wallMaxMultiplier = 50000;
	    
        let formattedTargets = {};
        
        _.forEach(this.structures, function(s) { 
            
            let hpPercent;
            
            if(s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART){
                hpPercent = s.hits / s.hitsMax;
            }
            else{
                hpPercent = s.hits / (this.controller.level * wallMaxMultiplier);
            }
            
            if(hpPercent < 1){
                formattedTargets[s.id] = hpPercent;
            }
            
        }, this);
        
        this.memory.repairTargets = formattedTargets;
        
    }


Room.prototype.getEnemyCreeps = function () {
    
        let enemies = this.find(FIND_HOSTILE_CREEPS);
        
        let combatCreeps = [], healCreeps = [], otherCreeps = [];
        
        if(enemies.length > 0){
            //filter out ally creeps
            enemies = _.filter(enemies, creep => !creep.isAlly);
            
            _.forEach(enemies, function(creep) {
                
                let creepParts = creep.body;
                
                let attackParts = _.remove(creepParts, part => part.type == ATTACK).length;
                let rangedParts = _.remove(creepParts, part => part.type == RANGED_ATTACK).length;
                let healParts   = _.remove(creepParts, part => part.type == HEAL).length;
                let otherParts = creepParts.length;
                
                if(attackParts > 0 || rangedParts > 0)
                    combatCreeps.push(creep);
                else if(healParts > 0)
                    healCreeps.push(creep);
                else
                    otherCreeps.push(creep);
                    
            });
        }
     
        this.memory.enemies = {};
        
        this.memory.enemies["combatCreeps"] = _.map(combatCreeps, c => c.id);
        this.memory.enemies["healCreeps"] = _.map(healCreeps, c => c.id);
        this.memory.enemies["otherCreeps"] = _.map(otherCreeps, c => c.id);
        
    }
