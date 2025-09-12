import * as fcl from '@onflow/fcl';

const GET_MAX_SUPPLY = `
import Bag from 0x337e140cac71c1f0

access(all) fun main(): UInt64 {
    return Bag.maxSupply
}`;

export async function getMaxSupply() {
  try {
    const response = await fcl.query({
      cadence: GET_MAX_SUPPLY,
    });
    return response;
  } catch (error) {
    console.error('Error in getting Bag max supply:', error);
    throw error;
  }
}
