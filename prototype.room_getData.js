

Room.prototype.getData = {
    run: function (room) {
        
        /****************************/
        /* Functions performed once */
        /****************************/
        
        this.getSources(room);
        
        /**********************************/
        /* Functions performed every tick */
        /**********************************/
        
        this.getStructures(room);
        
        this.getConstructionSites(room);
        
        this.getDroppedEnergy(room);
        
    },
    
    
    
    getSources: function (room) {
        
        
        
        let roomSources = room.find(FIND_SOURCES);
        
        let formattedSources = {};
        
        _.forEach(roomSources, source => formattedSources[source.id] = {});
        
        room.memory.sources = formattedSources;
        
    },
    
    
    
    getStructures: function (room) {
        
        
        
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
        
        let roomStructures = room.find(FIND_STRUCTURES);
        
        _.forEach(structuresConstants, function(constant) {
            sortedStructures[constant] = _.map(_.remove(roomStructures, s => s.structureType == constant), o => o.id);
        });
        
        room.memory.structures = sortedStructures;
        
        
        
    },
    
    
    
    getConstructionSites: function (room) {
        
        
        
        let roomConstructionSites = _.filter(Game.constructionSites, cs => cs.pos.roomName == room.name);
        
        room.memory.constructionSites = _.map(roomConstructionSites, cs => cs.id);
        
        
    },
    
    
    
    getDroppedEnergy: function (room) {
        
        
        
        let roomDrops = room.find(FIND_DROPPED_RESOURCES, { 
            filter: { resourceType: RESOURCE_ENERGY } });
        
        
        let formattedDrops = {};
        
        _.forEach(roomDrops, de => formattedDrops[de.id] = de.amount );
        
        room.memory.droppedEnergy = formattedDrops;
        
        
            
    },
    
    
    
};
