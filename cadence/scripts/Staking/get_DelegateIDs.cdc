import FlowStakingCollection from 0x8d0e87b65159ae63


access(all) fun main(address: Address): [FlowStakingCollection.DelegatorIDs] {
    return FlowStakingCollection.getDelegatorIDs(address: address)
}