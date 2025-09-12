import * as fcl from '@onflow/fcl';

const GET_RESERVE_MINTED = `
import Bag from 0x337e140cac71c1f0

access(all) fun main(): UInt64 {
    return Bag.reservedMinted
}
`;

export async function getReserveMint() {
  try {
    const response = await fcl.query({
      cadence: GET_RESERVE_MINTED,
    });
    return response;
  } catch (error) {
    console.error('Error in getting Bag reserve mint:', error);
    throw error;
  }
}
