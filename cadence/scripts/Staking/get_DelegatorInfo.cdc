import FlowStakingCollection from "../../contracts/FlowStakingCollection.cdc"
import FlowIDTableStaking from "../../contracts/FlowIDTableStaking.cdc"

/// Gets an array of all the delegator metadata for delegators stored in the staking collection

access(all) fun main(address: Address): [FlowIDTableStaking.DelegatorInfo] {
    return FlowStakingCollection.getAllDelegatorInfo(address: address)
}