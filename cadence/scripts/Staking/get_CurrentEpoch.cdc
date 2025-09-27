import FlowEpoch from "../../contracts/FlowEpoch.cdc"

access(all) fun main(): UInt64 {
    return FlowEpoch.currentEpochCounter
}