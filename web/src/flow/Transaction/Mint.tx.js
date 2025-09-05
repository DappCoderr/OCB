import * as fcl from '@onflow/fcl';

const MINT = `import Bag from 0xdb2133aaf990813c
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

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
} `;

export async function mintNFT(amount) {
  try {
    const response = await fcl.mutate({
      cadence: MINT,
      args: (arg, t) => [arg(amount, t.UFix64)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });
    const res = await fcl.tx(response).onceSealed();
    return res;
  } catch (error) {
    // Robust error handling
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
}
