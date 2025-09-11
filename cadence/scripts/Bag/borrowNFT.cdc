import Bag from "../../contracts/Bag.cdc"

access(all) fun main(user:Address, id:UInt64): &Bag.NFT {
    return Bag.borrowNFT(ownerAddress: user, nftId: id)
}