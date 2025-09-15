import * as fcl from '@onflow/fcl';

const GET_BAG_PRICE = `
import Bag from 0xBag

access(all) fun main(): UFix64 {
    return Bag.mintPrice
}`;

export async function getBagPrice() {
  try {
    const response = await fcl.query({
      cadence: GET_BAG_PRICE,
    });
    return response;
  } catch (error) {
    console.error('Error in getting Bag price:', error);
    throw error;
  }
}
