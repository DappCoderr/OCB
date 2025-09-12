import * as fcl from '@onflow/fcl';

const GET_TOTAL_SUPPLY = `
import Bag from 0x337e140cac71c1f0

access(all) fun main(): UInt64 {
    return Bag.totalSupply
}
`;

export async function getTotalSupply() {
  try {
    const response = await fcl.query({
      cadence: GET_TOTAL_SUPPLY,
    });
    return response;
  } catch (error) {
    console.error('Error in getting Bag total supply:', error);
    throw error;
  }
}
