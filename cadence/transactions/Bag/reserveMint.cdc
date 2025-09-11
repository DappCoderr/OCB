import TestBag from "../../contracts/TestBag.cdc"
import FungibleToken from "../../contracts/interface/FungibleToken.cdc"
import FlowToken from "../../contracts/interface/FlowToken.cdc"

transaction(user:Address){

    let adminRef: &TestBag.Admin
    let collectionRef: &TestBag.Collection

    prepare(signer: auth(Storage, Capabilities) &Account) {

        if signer.storage.borrow<&TestBag.Collection>(from: TestBag.CollectionStoragePath) == nil {
            signer.storage.save(<- TestBag.createEmptyCollection(nftType: Type<@TestBag.NFT>()), to: TestBag.CollectionStoragePath)
            let collectionCap = signer.capabilities.storage.issue<&TestBag.Collection>(TestBag.CollectionStoragePath)
            signer.capabilities.publish(collectionCap, at: TestBag.CollectionPublicPath) 
        }

        self.collectionRef = signer.storage.borrow<&TestBag.Collection>(from: TestBag.CollectionStoragePath) ?? panic("Could not found the collection")

        self.adminRef = signer.storage.borrow<&TestBag.Admin>(from: TestBag.AdminStoragePath) ?? panic("Could not found the Admin in storage")

    }

    execute{
        let nft <- self.adminRef.mintReservedNFT(recipient: user)
        self.collectionRef.deposit(token: <- nft)
    }
}                                                                               