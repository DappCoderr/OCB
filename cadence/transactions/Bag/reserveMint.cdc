import FungibleToken from "../../contracts/interface/FungibleToken.cdc"
import FlowToken from "../../contracts/interface/FlowToken.cdc"
import Bag from "../../contracts/Bag.cdc"

transaction(user:Address){

    let adminRef: &Bag.Admin
    let collectionRef: &Bag.Collection

    prepare(signer: auth(Storage, Capabilities) &Account) {

        if signer.storage.borrow<&Bag.Collection>(from: Bag.CollectionStoragePath) == nil {
            signer.storage.save(<- Bag.createEmptyCollection(nftType: Type<@Bag.NFT>()), to: Bag.CollectionStoragePath)
            let collectionCap = signer.capabilities.storage.issue<&Bag.Collection>(Bag.CollectionStoragePath)
            signer.capabilities.publish(collectionCap, at: Bag.CollectionPublicPath) 
        }

        self.collectionRef = signer.storage.borrow<&Bag.Collection>(from: Bag.CollectionStoragePath) ?? panic("Could not found the collection")
        self.adminRef = signer.storage.borrow<&Bag.Admin>(from: Bag.AdminStoragePath) ?? panic("Could not found the Admin in storage")

    }

    execute{
        let nft <- self.adminRef.mintReservedNFT(recipient: user)
        self.collectionRef.deposit(token: <- nft)
    }
}                                                                               