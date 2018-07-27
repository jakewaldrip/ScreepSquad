module.exports = {
    assignJobs: function(room) {
        
        this.assignMinerJobs(room);
        
    },
    
    assignMinerJobs: function(room) {
        //miners that need a task
        let waitingMiners = _.filter(Game.creeps, creep => 
            (creep.home == room.name && creep.role == "miner" 
            && creep.workTarget == null) );
        
        let jobQueue = _.pairs( room.jobQueues.minerJobs );
           
        _.forEach(waitingMiners, function(miner) {
            
            if(jobQueue.length > 0){
                
                let job = jobQueue.shift();
                
                delete room.jobQueues.minerJobs[job[0]];
                
                miner.workTarget = job[0];
                miner.state = job[1];
                
            }

        });
    },
    
    assignDroneJobs: function(room) {
        
        
        
    },
    
    assignWorkerJobs: function(room) {
        
        
        
    }
    
}