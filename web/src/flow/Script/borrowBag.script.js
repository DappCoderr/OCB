import * as fcl from '@onflow/fcl';

const BORROW_BAG = `
import Bag from 0xBag

access(all) fun main(user:Address, id:UInt64): &Bag.NFT {
    return Bag.borrowNFT(ownerAddress: user, nftId: id)
}
`;

export async function borrowBag(address, id) {
  try {
    const response = await fcl.query({
      cadence: BORROW_BAG,
      args: (arg, t) => [arg(address, t.Address), arg(id, t.UInt64)],
    });
    return response;
  } catch (error) {
    console.error('Error Borrowing Bag NFT:', error);
    throw error;
  }
}
