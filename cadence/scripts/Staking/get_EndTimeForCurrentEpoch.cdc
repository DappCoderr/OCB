import FlowEpoch from 0x8624b52f9ddcd04a

access(all) fun main(targetEpoch: UInt64): UInt64 {
    pre {
        targetEpoch >= FlowEpoch.currentEpochCounter
    }
    let config = FlowEpoch.getEpochTimingConfig()
    return config.getTargetEndTimeForEpoch(targetEpoch)
}