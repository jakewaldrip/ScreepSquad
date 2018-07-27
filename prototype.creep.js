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

Object.defineProperty(Creep.prototype, 'home', {
    
    get: function() {
        if(!this.memory.home){
            return undefined;
        }
        else{
            return this.memory.home;
        }
    },
    set: function(value) {
        
        this.memory.home = value;
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