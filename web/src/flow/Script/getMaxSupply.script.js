import * as fcl from '@onflow/fcl';

const GET_MAX_SUPPLY = `
import Bag from 0xdb2133aaf990813c

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
    console.error('Error get bag max supply:', error);
    throw error;
  }
}
