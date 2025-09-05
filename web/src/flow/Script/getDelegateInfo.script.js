import * as fcl from '@onflow/fcl';

export const GET_DELEGATE_INFO = `
import FlowStakingCollection from 
import FlowIDTableStaking from 

access(all) fun main(address: Address): [FlowIDTableStaking.DelegatorInfo] {
    return FlowStakingCollection.getAllDelegatorInfo(address: address)
}  
`;

export async function getDelegateInfo(address) {
  try {
    const response = await fcl.query({
      cadence: GET_DELEGATE_INFO,
      args: (arg, t) => [arg(address, t.Address)],
    });
    return response;
  } catch (error) {
    console.error('Error in getting delegate Info:', error);
    throw error;
  }
}
