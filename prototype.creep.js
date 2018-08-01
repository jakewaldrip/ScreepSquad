Creep.prototype.run = function() {
    
    let role = {
        
        drone: require('role.Drone'),
        
        miner: require('role.Miner'),
        
        worker: require('role.Worker')
        
    };
    
    if(role[this.role])
        role[this.role].run(this);
    
}

Creep.prototype.useEnergy = function(targetObj) {
    
    if(targetObj instanceof String){
        targetObj = Game.getObjectById(targetObj);
    }
    
    if(targetObj instanceof StructureSpawn || targetObj instanceof StructureExtension || targetObj instanceof StructureStorage){
        return this.transfer(targetObj, RESOURCE_ENERGY);
    }
    if(targetObj instanceof ConstructionSite){
        return this.build(targetObj);
    }
    else if(targetObj instanceof StructureController){
        return this.upgradeController(targetObj);
    }
    else if(targetObj instanceof Structure){
        return this.repair(targetObj);
    }
    else{
        return ERR_INVALID_TARGET;
    }
}

Creep.prototype.getEnergy = function(targetObj){
    
    if(targetObj instanceof String){
        targetObj = Game.getObjectById(targetObj);
    }
    
    if(targetObj instanceof Energy || targetObj instanceof Mineral){
        return this.pickup(targetObj);
    }
    else if(targetObj instanceof Structure){
        return this.withdraw(targetObj);
    }
    else{
        return ERR_INVALID_TARGET;
    }
}

Object.defineProperty(Creep.prototype, 'Full', {
    get: function(){ return (_.sum(this.carry) == this.carryCapacity); }
});

Object.defineProperty(Creep.prototype, 'Empty', {
    get: function(){ return (_.sum(this.carry) == 0); }
});

Object.defineProperty(Creep.prototype, 'role', {
    
    get: function() {
        if(!this.memory.role){
            return undefined;
        } 
        else{
            return this.memory.role;
        }
    },
    set: function(value) {
        
        this.memory.role = value;
    }
    
});

Object.defineProperty(Creep.prototype, 'homeRoom', {
    
    get: function() {
        if(!this.memory.homeRoom){
            return undefined;
        }
        else{
            return this.memory.homeRoom;
        }
    },
    set: function(value) {
        
        this.memory.homeRoom = value;
    }
    
});

Object.defineProperty(Creep.prototype, 'workTarget', {
    
    get: function() {
        if(!this.memory.workTarget){
            return undefined;
        }
        else{
            return this.memory.workTarget;
        }
    },
    set: function(value) {
        
        this.memory.workTarget = value;
    }
    
});

Object.defineProperty(Creep.prototype, 'state', {
    
    get: function() {
        if(!this.memory.state){
            return undefined;
        }
        else{
            return this.memory.state;
        }
    },
    set: function(value) {
        
        this.memory.state = value;
    }
    
});

