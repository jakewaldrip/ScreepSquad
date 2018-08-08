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