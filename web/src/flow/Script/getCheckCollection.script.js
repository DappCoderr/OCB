import * as fcl from '@onflow/fcl';

export const GET_COLLECTION_CHECK = `
import Bag from 0xdb2133aaf990813c

access(all) fun main(addr:Address): Bool{
    let account = getAccount(addr)
    let capRef = account.capabilities.get<&Bag.Collection>(Bag.CollectionPublicPath)
    return capRef.check()
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
