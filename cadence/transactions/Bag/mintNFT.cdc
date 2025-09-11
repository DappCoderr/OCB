import FungibleToken from "../../contracts/interface/FungibleToken.cdc"
import FlowToken from "../../contracts/interface/FlowToken.cdc"
import Bag from "../../contracts/Bag.cdc"

transaction(amount:UFix64){

    let flowToken: @FlowToken.Vault
    let collectionRef: &Bag.Collection

    prepare(signer: auth(Storage, Capabilities) &Account) {

        if signer.storage.borrow<&Bag.Collection>(from: Bag.CollectionStoragePath) == nil {
            signer.storage.save(<- Bag.createEmptyCollection(nftType: Type<@Bag.NFT>()), to: Bag.CollectionStoragePath)
            let collectionCap = signer.capabilities.storage.issue<&Bag.Collection>(Bag.CollectionStoragePath)
            signer.capabilities.publish(collectionCap, at: Bag.CollectionPublicPath) 
        }

        self.collectionRef = signer.storage.borrow<&Bag.Collection>(from: Bag.CollectionStoragePath) ?? panic("Could not borrow a reference to a Bag Collection in the user's account")

        let flowVault = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)!
        self.flowToken <- flowVault.withdraw(amount: amount) as! @FlowToken.Vault
    }

    execute{
        let nft <- Bag.mintNFT(payment: <- self.flowToken)
        self.collectionRef.deposit(token: <- nft)
    }
}                                                                               