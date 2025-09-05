import * as fcl from '@onflow/fcl';

const GET_TOTAL_SUPPLY = `
import Bag from 0xdb2133aaf990813c
access(all) fun main(): UInt64 {
    return Bag.totalSupply
}`;

export async function getTotalSupply() {
  try {
    const response = await fcl.query({
      cadence: GET_TOTAL_SUPPLY,
    });
    return response;
  } catch (error) {
    console.error('Error get bag total supply:', error);
    throw error;
  }
}
