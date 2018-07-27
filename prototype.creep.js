Creep.prototype.run = function() {
    
    let role = {
        
        drone: require('role.Drone'),
        
        miner: require('role.Miner'),
        
        worker: require('role.Worker')
        
    };
    
    role[this.role].run(this);
    
}

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