import FlowEpoch from "../../contracts/interface/FlowEpoch.cdc"

access(all) fun main(): UInt64 {
    return FlowEpoch.currentEpochCounter
}