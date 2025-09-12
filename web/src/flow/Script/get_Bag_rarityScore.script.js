import * as fcl from '@onflow/fcl';

const GET_BAG_RARITY_SCORE = `
import Bag from 0x337e140cac71c1f0

access(all) fun main(user:Address, id:UInt64): UInt64 {
    return Bag.getNFTRarityScore(ownerAddress: user, nftId: id)
}

`;

export async function getBagRarityScore(address, id) {
  try {
    const response = await fcl.query({
      cadence: GET_BAG_RARITY_SCORE,
      args: (arg, t) => [arg(address, t.Address), arg(id, t.UInt64)],
    });
    return response;
  } catch (error) {
    console.error('Error in getting Bag rarity score:', error);
    throw error;
  }
}