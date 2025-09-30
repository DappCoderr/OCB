import * as fcl from '@onflow/fcl';

const GET_TOKEN_STAKED = `
import FlowIDTableStaking from 0xFlowIDTableStaking

access(all) fun main(nodeID: String, delegatorID: UInt32): UFix64 {
    let delInfo = FlowIDTableStaking.DelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)
    return delInfo.tokensStaked
}
`;

export async function getTokenStaked() {
  try {
    const response = await fcl.query({
      cadence: GET_TOKEN_STAKED,
    });
    return response;
  } catch (error) {
    console.error('Error in getting token staked:', error);
    throw error;
  }
}