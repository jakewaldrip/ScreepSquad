module.exports = {
    assignJobs: function(room) {
        
        this.assignMinerJobs(room);
        
        this.assignDroneJobs(room);
        
        this.assignWorkerJobs(room);
    },
    
    assignMinerJobs: function(room) {
        //miners that need a task
        let idleMiners = _.filter(Game.creeps, creep => 
            (creep.home == room.name && creep.role == "miner" 
            && creep.workTarget == null) );
        
        if(idleMiners.length > 0){
        
            let jobQueue = _.pairs( room.jobQueues.minerJobs );
               
            _.forEach(idleMiners, function(miner) {
                
                if(jobQueue.length > 0){
                    
                    let job = jobQueue.shift();
                    
                    delete room.jobQueues.minerJobs[job[0]];
                    
                    miner.workTarget = job[0];
                    miner.state = job[1];
                    
                }
    
            });
        
        }
    },
    
    assignDroneJobs: function(room) {
        
        let idleDrones = _.filter(Game.creeps, creep =>
            (creep.home == room.name && creep.role == "drone" 
            && creep.workTarget == null));
        
        if (idleDrones.length > 0){
            
            let jobQueue = _.pairs( room.jobQueues.droneJobs );
            
            _.forEach(idleDrones, function(drone) {
               
               if(jobQueue.length > 0){
                   
                   let job = jobQueue.shift();
                   
                   delete room.jobQueues.droneJobs[job[0]];
                   
                   miner.workTarget = job[0];
                   miner.state = job[1];
               } 
            });
        }
    },
    
    assignWorkerJobs: function(room) {
        let upgradingController = false;
        
        let workers = _.filter(Game.creeps, creep => (creep.home == room.name && creep.role == "worker"));
        
        let idleWorkers = [];
        
        _.forEach(workers, function(worker) {
           
           if(worker.workTarget == null){
               idleWorkers.push(worker);
           }
           else if(worker.workTarget == room.controller.id){
               upgradingController = true;
           }
            
        });
        
        if(idleWorkers.length > 0){
            
            let jobQueue = _.pairs( room.jobQueues.workerJobs );
            
            _.forEach(idleWorkers, function(worker) {
               
               let job;
               
               if(upgradingController == false || jobQueue.length == 0){
                   job = [];
                   job[0] = room.controller.id;
                   job[1] = "UPGRADE";
                   upgradingController = true;
                }
                else{
                    
                    job = jobQueue.shift();
                    
                    delete room.jobQueues.workerJobs[job[0]];
                }
                
                worker.workTarget = job[0];
                worker.state = "STATE_USE_ENERGY";
                
            });
            
        }
        
    }
    
}