/** @namespace Room_GetData */

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
        
        this.getEvents();
        
        this.getStructures();
        
        this.assignContainersToSources();
        
        this.getConstructionSites();
        
        this.getDroppedEnergy();
        
        this.getRepairTargets();
	
	    this.getEnemyCreeps();
	    //Important that this is called after getEnemyCreeps();
	    this.getDefconLevel();    
    }
    
    
    
Room.prototype.getSources = function () {
        
        if(!this.memory.sources){
            
            
            let roomSources = this.find(FIND_SOURCES);
            
            let formattedSources = {};
            
            let room = this;
            
            _.forEach(roomSources, function(source) {
                
                formattedSources[source.id] = {};
                
                //TO-DO:
                //Replace the below line using the new inexpensive Room.getTerrain and TerrainObj.get(x, y)
                //Should save a small amount of CPU
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
    
Room.prototype.getEvents = function () {
    let upgradingThisTick = 0;
    
    let eventLog = this.getEventLog();
    
    _.forEach(eventLog, function(event) {
        
        switch(event["event"]) {
            
            case 1: //EVENT_ATTACK
                //console.log(JSON.stringify(event));
                break;
                
            case 2: //EVENT_OBJECT_DESTROYED
                //console.log("An object of type", event["type"], "was destroyed.");
                if(event["type"] != "creep"){
                    //console.log("not a creep tho!");
                }
                else if(event["type"] == "creep"){
                    //console.log("RIP Creep");
                }
                break;
                
            case 3: //EVENT_ATTACK_CONTROLLER
                break;
                
            case 4: //EVENT_BUILD
            
                // can track progress of const site, who is building it
                let object = Game.getObjectById(event.data["targetId"]);
                
                if(object == null){
                    //if object is null on build event then we know that something was completed
                    console.log("Something has been built");
                }
                break;
                
            case 5: //EVENT_HARVEST
                break;
                
            case 6: //EVENT_HEAL
                //console.log(JSON.stringify(event));
                break;
                
            case 7: //EVENT_REPAIR
                //console.log(JSON.stringify(event));
                break;
                
            case 8: //EVENT_RESERVE_CONTROLLER
                break;
            
            case 9: //EVENT_UPGRADE_CONTROLLER
                upgradingThisTick += event.data["amount"];
                break;
                
            case 10: //EVENT_EXIT
                break;
                
        }
    });
    
    //if(upgradingThisTick > 0)
    //    console.log("Controller upgraded by", upgradingThisTick);
}
    
Room.prototype.getStructures = function () {
        
        
        
        const structuresConstants = {
            STRUCTURE_ROAD, STRUCTURE_EXTENSION, STRUCTURE_WALL,
            STRUCTURE_RAMPART, STRUCTURE_SPAWN, STRUCTURE_CONTROLLER,
            STRUCTURE_CONTAINER, STRUCTURE_LINK, STRUCTURE_STORAGE, 
            STRUCTURE_TOWER, STRUCTURE_OBSERVER, STRUCTURE_EXTRACTOR,
            STRUCTURE_LAB, STRUCTURE_TERMINAL, STRUCTURE_NUKER,
            STRUCTURE_KEEPER_LAIR, STRUCTURE_PORTAL,
            STRUCTURE_POWER_BANK, STRUCTURE_POWER_SPAWN
        }
        
        let sortedStructures = {};
        
        //TO-DO:
        //Replace this with a check if the Event_Log has a build event or a destroy event,
        //and see if we can reduce how often we have to refresh this memory obj
        let roomStructures = this.find(FIND_STRUCTURES);
        
        _.forEach(structuresConstants, function(constant) {
            sortedStructures[constant] = _.map(_.remove(roomStructures, s => s.structureType == constant), o => o.id);
        });
        
        this.memory.structures = sortedStructures;
        
        
        
    }

/**
 * Assigns a container to the source.container property if there is one
 * <p>Requires that Room.getStructures and Room.getSources have been run.</p>
 * @param {StructureContainer[]} containers All container structures in the room
 */
Room.prototype.assignContainersToSources = function(containers){
    
    _.forEach(Object.keys(this.memory.sources), function(srcID) {
        
        let source = Game.getObjectById(srcID);
        
        if(source.container == null || Game.getObjectById(source.container) == null){
            
            let containers = this.memory.structures[STRUCTURE_CONTAINER].getObjects();
            
            _.forEach(containers, function(container) {
                
                let dx = Math.abs(source.pos.x - container.pos.x);
                let dy = Math.abs(source.pos.y - container.pos.y);
                
                if(dx <= 1 && dy <= 1){
                    source["container"] = container;
                }
                
            });
            
        }
        else{
            //do nothing
        }
        
    }, this);
    
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
	    //change this to change how high walls and ramparts are repaired
	    const wallMaxHealth = {
	        0: 0,
	        1: 15000,
	        2: 30000,
	        3: 45000,
	        4: 80000,
	        5: 100000,
	        6: 250000,
	        7: 750000,
	        8: 10000000
	    }
        let formattedTargets = {};
        
        _.forEach(this.structures, function(s) { 
            
            let hpPercent;
            
            if(s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART){
                hpPercent = s.hits / s.hitsMax;
            }
            else{
                hpPercent = s.hits / (wallMaxHealth[this.controller.level]);
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
