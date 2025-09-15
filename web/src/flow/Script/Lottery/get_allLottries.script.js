import * as fcl from '@onflow/fcl';

const GET_ALL_BAG_LOTTERY = `
import BagLottery from 0xBagLottery

access(all) fun main(): [&BagLottery.Lottery] {
    return BagLottery.getAllLotteries()
}
`;

export async function getAllBagLottery() {
  try {
    const response = await fcl.query({
      cadence: GET_ALL_BAG_LOTTERY,
    });
    return response;
  } catch (error) {
    console.error('Error in getting Bag Lottery details:', error);
    throw error;
  }
}