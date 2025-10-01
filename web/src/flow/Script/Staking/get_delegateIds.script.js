import * as fcl from '@onflow/fcl';

const GET_DELEGATE_IDS = `
import FlowStakingCollection from 0xFlowStakingCollection

access(all) fun main(address: Address): [FlowStakingCollection.DelegatorIDs] {
    return FlowStakingCollection.getDelegatorIDs(address: address)
}
`;

export async function getDelegatorIDs(address) {
  try {
    const response = await fcl.query({
      cadence: GET_DELEGATE_IDS,
      args: (arg, t) => [arg(address, t.Address)],
    });
    return response;
  } catch (error) {
    console.error('Error in getting delegate ids counter:', error);
    throw error;
  }
}
