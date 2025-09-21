import * as fcl from '@onflow/fcl';

export const MINT = `
import Bag from 0xBag
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken

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

`;

export const mintNFT = async (user, amount, mintQty) => {
  try {
    const transactionId = await fcl.mutate({
      cadence: MINT,
      args: (arg, t) => [
        arg(user, t.Address),
        arg(amount, t.UFix64),
        arg(mintQty, t.UInt64),
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });

    return transactionId;
  } catch (error) {
    const msg =
      (typeof error === 'string' && error) ||
      (error && error.message) ||
      (error && error.errorMessage) ||
      'Transaction failed';

    if (msg.toLowerCase().includes('declined')) {
      throw new Error('User denied transaction');
    }
    throw new Error(msg);
  }
};
