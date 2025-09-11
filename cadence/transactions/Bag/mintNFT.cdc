import FungibleToken from "../../contracts/interface/FungibleToken.cdc"
import FlowToken from "../../contracts/interface/FlowToken.cdc"
import Bag from "../../contracts/Bag.cdc"

transaction(user: Address, amount: UFix64, mintQty: UInt64) {

    let flowTokenVault: @FlowToken.Vault
    let collectionRef: &Bag.Collection
    let userVaultRef: &FlowToken.Vault

    prepare(signer: auth(Storage, Capabilities) &Account) {

        if signer.storage.borrow<&Bag.Collection>(from: Bag.CollectionStoragePath) == nil {
            signer.storage.save(
                <- Bag.createEmptyCollection(nftType: Type<@Bag.NFT>()),
                to: Bag.CollectionStoragePath
            )

            let collectionCap = signer.capabilities.storage.issue<&Bag.Collection>(Bag.CollectionStoragePath)
            signer.capabilities.publish(collectionCap, at: Bag.CollectionPublicPath) 
        }

        // Borrow reference to the collection
        self.collectionRef = signer.storage.borrow<&Bag.Collection>(from: Bag.CollectionStoragePath)
            ?? panic("Could not borrow a reference to a Bag Collection in the user's account")

        // Borrow withdraw capability for FlowToken Vault
        let vaultRef = signer.storage
            .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to FlowToken Vault")

        // Withdraw total amount user sent for this minting
        self.flowTokenVault <- vaultRef.withdraw(amount: amount) as! @FlowToken.Vault

        // Borrow deposit reference so we can refund later in execute
        self.userVaultRef = signer.storage
            .borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow deposit reference to FlowToken Vault for refund")
    }

    execute {
        var i: UInt64 = 0
        let pricePerMint = Bag.mintPrice

        while i < mintQty {
            let payment <- self.flowTokenVault.withdraw(amount: pricePerMint) as! @FlowToken.Vault
            let nft <- Bag.mintNFT(user: user, payment: <- payment)
            self.collectionRef.deposit(token: <- nft)
            i = i + 1
        }

        // Return any leftover FLOW tokens to the user's vault
        if self.flowTokenVault.balance > 0.0 {
            self.userVaultRef.deposit(from: <- self.flowTokenVault)
        } else {
            destroy self.flowTokenVault
        }
    }
}
