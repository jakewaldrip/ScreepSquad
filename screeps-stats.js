module.exports = {
    
    getStats: function(roomObject) {
        
        Memory.stats = {};
        
        this.cpuStats();
        
        this.gclStats();
        
        this.roomEnergy(roomObject);
        
        this.rclStats(roomObject);
    },
    
    cpuStats: function() {
        
        Memory.stats['cpu.getUsed'] = Game.cpu.getUsed();
        
        Memory.stats['cpu.limit'] = Game.cpu.limit;
        
        Memory.stats['cpu.bucket'] = Game.cpu.bucket;
        
    },
    
    gclStats: function() {
        
        Memory.stats['gcl.progress'] = Game.gcl.progress;
        
        Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal;
        
        Memory.stats['gcl.level'] = Game.gcl.level;
        
    },
    
    rclStats: function(room) {
        if(room.controller && room.controller.my){
            Memory.stats["room." + room.name + ".progress"] = room.controller.progress;
            
            Memory.stats["room." + room.name + ".progressTotal"] = room.controller.progressTotal;
            
            Memory.stats["room." + room.name + ".level"] = room.controller.level;
        }
    },
    
    roomEnergy: function(room) {
        let storage_store = 0;
        if(room.storage){ 
            storage_store = room.storage.store[RESOURCE_ENERGY];
        }
        
        Memory.stats["room." + room.name + ".storage"] = storage_store;
        
        
        if(room.memory.structures){
            
            for(let i = 0; i < room.memory.structures[STRUCTURE_CONTAINER].length; i++){
                let container = Game.getObjectById(room.memory.structures[STRUCTURE_CONTAINER][i]);
                
                Memory.stats["room." + room.name + ".container." + i] = container.store[RESOURCE_ENERGY];
                
            }
            
        }
        
        let droppedEnergy = 0;
        if(_.size(room.memory.droppedEnergy) > 0 )
            droppedEnergy = _.sum(Object.keys(room.memory.droppedEnergy), id => Game.getObjectById(id).amount);
            
        Memory.stats["room." + room.name + ".dropped"] = droppedEnergy;
    }
};