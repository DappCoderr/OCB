import Bag from "../../contracts/Bag.cdc"

access(all) fun main(user:Address, id:UInt64): UInt64 {
    return Bag.getNFTWinCount(ownerAddress: user, nftId: id)
}