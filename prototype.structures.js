/** @namespace Structures */
Structure.prototype.energyAvailable = function() {
    
    if(!this.store) return 0;
    
    return this.store[RESOURCE_ENERGY];
    
};

Source.prototype.energyAvailable = function() {
    
    return this.energyCapacity - this.energy;
    
};

Resource.prototype.energyAvailable = function() {
    
    if(!this.resourceType == RESOURCE_ENERGY) return 0;
    
    return this.amount;
    
};

Object.defineProperty(Source.prototype, "container", {
   
    get: function() {
       
        if(this.room.memory.sources && this.room.memory.sources[this.id]){
           
            return this.room.memory.sources[this.id].container;
           
        }
       
    },
   
    set: function(value) {
       
        if(this.room.memory.sources && this.room.memory.sources[this.id]){
           
            if(value instanceof Object)
                value = value.id;
           
            this.room.memory.sources[this.id].container = value;
           
        }
    }
});