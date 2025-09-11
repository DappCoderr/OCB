import TestBag from "../../contracts/TestBag.cdc"
import FungibleToken from "../../contracts/interface/FungibleToken.cdc"
import FlowToken from "../../contracts/interface/FlowToken.cdc"

transaction(amount:UFix64){

    let flowToken: @FlowToken.Vault
    let collectionRef: &TestBag.Collection

    prepare(signer: auth(Storage, Capabilities) &Account) {

        if signer.storage.borrow<&TestBag.Collection>(from: TestBag.CollectionStoragePath) == nil {
            signer.storage.save(<- TestBag.createEmptyCollection(nftType: Type<@TestBag.NFT>()), to: TestBag.CollectionStoragePath)
            let collectionCap = signer.capabilities.storage.issue<&TestBag.Collection>(TestBag.CollectionStoragePath)
            signer.capabilities.publish(collectionCap, at: TestBag.CollectionPublicPath) 
        }

        self.collectionRef = signer.storage.borrow<&TestBag.Collection>(from: TestBag.CollectionStoragePath) ?? panic("Could not borrow a reference to a Bag Collection in the user's account")

        let flowVault = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)!
        self.flowToken <- flowVault.withdraw(amount: amount) as! @FlowToken.Vault
    }

    execute{
        let nft <- TestBag.mintNFT(payment: <- self.flowToken)
        self.collectionRef.deposit(token: <- nft)
    }
}                                                                               