import FlowStakingCollection from 0x95e019a17d0e23d7
import FlowIDTableStaking from 0x95e019a17d0e23d7

access(all) contract BagDistributionRatio {
    
    access(self) var targetAPY: UFix64
    
    access(all) fun calculateWeeklyDistribution(nodeID: String, delegatorID: UInt32): UFix64 {

        let tokenStaked = self.getTokenStaked(nodeID: nodeID, delegatorID: delegatorID)

        let targetWeekly = (tokenStaked * self.targetAPY) / 52.0
        
        return targetWeekly
    }

    access(all) fun getTokenStaked(nodeID: String, delegatorID: UInt32): UFix64 {
        let delInfo = FlowIDTableStaking.DelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)
        return delInfo.tokensStaked
    }

    access(all) fun updateTargetAPY(newAPY:UFix64){
        self.targetAPY = newAPY
    }

    access(all) view fun getTargetAPY(): UFix64 {
        return self.targetAPY
    }

    init() {
        self.targetAPY = 0.08
    }
}