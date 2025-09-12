import * as fcl from '@onflow/fcl';

const GET_RESERVE_SUPPLY = `
import Bag from 0x337e140cac71c1f0

access(all) fun main(): UInt64 {
    return Bag.reservedSupply
}
`;

export async function getReserveSupply() {
  try {
    const response = await fcl.query({
      cadence: GET_RESERVE_SUPPLY,
    });
    return response;
  } catch (error) {
    console.error('Error get bag reserve supply:', error);
    throw error;
  }
}
