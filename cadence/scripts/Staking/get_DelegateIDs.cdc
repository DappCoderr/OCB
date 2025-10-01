import FlowStakingCollection from "../../contracts/interface/FlowStakingCollection.cdc"


access(all) fun main(address: Address): [FlowStakingCollection.DelegatorIDs] {
    return FlowStakingCollection.getDelegatorIDs(address: address)
}