import * as fcl from '@onflow/fcl';

const GET_BAG_WIN_COUNT = `
import Bag from 0xBag

access(all) fun main(user:Address, id:UInt64): UInt64 {
    return Bag.getNFTWinCount(ownerAddress: user, nftId: id)
}

`;

export async function getBagWinCount(address, id) {
  try {
    const response = await fcl.query({
      cadence: GET_BAG_WIN_COUNT,
      args: (arg, t) => [arg(address, t.Address), arg(id, t.UInt64)],
    });
    return response;
  } catch (error) {
    console.error('Error get bag rarity score:', error);
    throw error;
  }
}