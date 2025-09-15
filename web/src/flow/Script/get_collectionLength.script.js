import * as fcl from '@onflow/fcl';

const GET_COLLECTION_LENGTH = `
import Bag from 0xBag

access(all) fun main(addr:Address): Int{
    return Bag.getCollectionLength(user: addr)
}
`;

export async function getCollectionLength(address) {
  try {
    const response = await fcl.query({
      cadence: GET_COLLECTION_LENGTH,
      args: (arg, t) => [arg(address, t.Address)],
    });
    return response;
  } catch (error) {
    console.error('Error in getting collection length:', error);
    throw error;
  }
}
