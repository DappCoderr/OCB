import FlowStakingCollection from "../../contracts/FlowStakingCollection.cdc"


access(all) fun main(address: Address): [FlowStakingCollection.DelegatorIDs] {
    return FlowStakingCollection.getDelegatorIDs(address: address)
}