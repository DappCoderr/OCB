import * as fcl from '@onflow/fcl';

const GET_CURRENT_EPOCH_PHASE = `
import FlowEpoch from 0xFlowEpoch

access(all) fun main(): UInt8 {
    return FlowEpoch.currentEpochPhase.rawValue
}
`;

export async function getEpochPhase() {
  try {
    const response = await fcl.query({
      cadence: GET_CURRENT_EPOCH_PHASE,
    });
    return response;
  } catch (error) {
    console.error('Error in getting current epoch phase:', error);
    throw error;
  }
}