import Bag from 0xf1d3e3f8e9788ea7
import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

transaction(amount: UFix64){
    let receiverCollectionRef: &{NonFungibleToken.CollectionPublic}
    let Payment: @FlowToken.Vault
    prepare(signer:AuthAccount){
        if signer.borrow<&Bag.Collection>(from: Bag.CollectionStoragePath) == nil {
            let collection <- Bag.createEmptyCollection()
            signer.save(<-collection, to: Bag.CollectionStoragePath)
            let cap = signer.capabilities.storage.issue<&{Bag.BagNFTCollectionPulbic}>(Bag.CollectionStoragePath)
            signer.capabilities.publish( cap, at: Bag.CollectionPublicPath)
        }
        self.receiverCollectionRef = signer.borrow<&Bag.Collection>(from: Bag.CollectionStoragePath)
      ?? panic("could not borrow Collection reference")

      let flowVault = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!
      self.Payment <- flowVault.withdraw(amount: amount) as! @FlowToken.Vault
    }

    execute{
        var nft <- Bag.mintNFT(payment: <- self.Payment)
        self.receiverCollectionRef.deposit(token: <-nft)
    }
}