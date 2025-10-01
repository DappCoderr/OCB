import * as fcl from '@onflow/fcl';

const GET_LOTTERY_VAULT_BALANCE = `
import BagLottery from 0xBagLottery

access(all) fun main(): UFix64 {
    return BagLottery.getLotteryVaultBalance()
}
`;

export async function getLotteryVaultBalance() {
  try {
    const response = await fcl.query({
      cadence: GET_LOTTERY_VAULT_BALANCE,
    });
    return response;
  } catch (error) {
    console.error('Error in getting Bag Lottery vault balance:', error);
    throw error;
  }
}
