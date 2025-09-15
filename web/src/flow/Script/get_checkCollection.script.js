import * as fcl from '@onflow/fcl';

const GET_COLLECTION_CHECK = `
import Bag from 0xBag

access(all) fun main(addr:Address): Bool{
    return Bag.hasCollection(user: addr)
}
`;

export async function getCheckCollection(address) {
  try {
    const response = await fcl.query({
      cadence: GET_COLLECTION_CHECK,
      args: (arg, t) => [arg(address, t.Address)],
    });
    return response;
  } catch (error) {
    console.error('Error in getting collection check:', error);
    throw error;
  }
}
