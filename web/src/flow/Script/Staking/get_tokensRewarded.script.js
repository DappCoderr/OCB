import * as fcl from '@onflow/fcl';

const GET_TOKEN_REWARDED = `
import FlowIDTableStaking from 0xFlowIDTableStaking

access(all) fun main(nodeID: String, delegatorID: UInt32): UFix64 {
    let delInfo = FlowIDTableStaking.DelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)
    return delInfo.tokensRewarded
}
`;

export async function getTokenRewarded(nodeId, delegateId) {
  try {
    const response = await fcl.query({
      cadence: GET_TOKEN_REWARDED,
      args: (arg, t) => [arg(nodeId, t.String), arg(delegateId, t.UInt32)],
    });
    return response;
  } catch (error) {
    console.error('Error in getting reward tokens staked:', error);
    throw error;
  }
}
