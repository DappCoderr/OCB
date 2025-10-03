import FlowIDTableStaking from "../../contracts/interface/FlowIDTableStaking.cdc"

access(all) fun main(nodeID: String, delegatorID: UInt32): UFix64 {
    let delInfo = FlowIDTableStaking.DelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)
    return delInfo.tokensStaked
}