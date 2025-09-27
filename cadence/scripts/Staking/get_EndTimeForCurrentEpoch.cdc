import FlowEpoch from "../../contracts/FlowEpoch.cdc"

access(all) fun main(targetEpoch: UInt64): UInt64 {
    pre {
        targetEpoch >= FlowEpoch.currentEpochCounter
    }
    let config = FlowEpoch.getEpochTimingConfig()
    return config.getTargetEndTimeForEpoch(targetEpoch)
}