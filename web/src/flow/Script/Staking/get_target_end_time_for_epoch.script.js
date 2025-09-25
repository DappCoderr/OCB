import * as fcl from '@onflow/fcl';

const GET_END_TIME_FOR_EPOCH = `
import FlowEpoch from 0xFlowEpoch

access(all) fun main(targetEpoch: UInt64): UInt64 {
    pre {
        targetEpoch >= FlowEpoch.currentEpochCounter
    }
    let config = FlowEpoch.getEpochTimingConfig()
    return config.getTargetEndTimeForEpoch(targetEpoch)
}
`;

export async function getEndTimeForEpoch(id) {
  try {
    const response = await fcl.query({
      cadence: GET_END_TIME_FOR_EPOCH,
      args: (arg, t) => [arg(id, t.UInt64)],
    });
    return response;
  } catch (error) {
    console.error('Error in getting epoch end time:', error);
    throw error;
  }
}
