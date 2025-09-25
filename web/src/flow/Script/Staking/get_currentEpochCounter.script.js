import * as fcl from '@onflow/fcl';

const GET_FLOW_CURRENT_EPOCH_COUNTER = `
import FlowEpoch from 0xFlowEpoch

access(all) fun main(): UInt64 {
    return FlowEpoch.currentEpochCounter
}

`;

export async function getFlowCurrentEpochCounter() {
  try {
    const response = await fcl.query({
      cadence: GET_FLOW_CURRENT_EPOCH_COUNTER,
    });
    return response;
  } catch (error) {
    console.error('Error in getting epoch counter:', error);
    throw error;
  }
}
