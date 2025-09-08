import Bag from "../contracts/Bag.cdc"
import FungibleToken from "../contracts/interface/FungibleToken.cdc"
import FlowToken from "../contracts/interface/FlowToken.cdc"

transaction(amount:UFix64){
    let Payment: @FlowToken.Vault
    let collectionRef: &Bag.Collection
    let userAddr: Address

    prepare(signer: auth(Storage, Capabilities) &Account) {

        if signer.storage.borrow<&Bag.Collection>(from: Bag.CollectionStoragePath) == nil {
            signer.storage.save(<- Bag.createEmptyCollection(nftType: Type<@Bag.NFT>()), to: Bag.CollectionStoragePath)
            let collectionCap = signer.capabilities.storage.issue<&Bag.Collection>(Bag.CollectionStoragePath)
            signer.capabilities.publish(collectionCap, at: Bag.CollectionPublicPath) 
        }

        self.collectionRef = signer.storage.borrow<&Bag.Collection>(from: Bag.CollectionStoragePath) ?? panic("Could not found the collection")

        let flowVault = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)!
        self.Payment <- flowVault.withdraw(amount: amount) as! @FlowToken.Vault
        self.userAddr = signer.address
    }

    execute{
        let nft <- Bag.mintNFT(addr: self.userAddr, payment: <- self.Payment)
        self.collectionRef.deposit(token: <- nft)
    }
}                                                                               