import * as fcl from '@onflow/fcl';

export const RESERVE_MINT = `
import MetadataViews from 0xMetadataViews
import Bag from 0xBag
import FlowToken from 0xFlowToken
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(user:Address, mintQty:UInt64){

    let adminRef: &Bag.Admin
    let recipientCollectionRef: &{NonFungibleToken.Receiver}

    prepare(signer: auth(Storage, Capabilities) &Account) {

         let collectionData = Bag.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
            ?? panic("Could not resolve NFTCollectionData view. The ExampleNFT contract needs to implement the NFTCollectionData Metadata view in order to execute this transaction")

        self.recipientCollectionRef = getAccount(user).capabilities.borrow<&{NonFungibleToken.Receiver}>(collectionData.publicPath)
            ?? panic("The recipient does not have a NonFungibleToken Receiver at "
                    .concat(collectionData.publicPath.toString())
                    .concat(" that is capable of receiving an NFT.")
                    .concat("The recipient must initialize their account with this collection and receiver first!"))

        self.adminRef = signer.storage.borrow<&Bag.Admin>(from: Bag.AdminStoragePath) ?? panic("Could not found the Admin in storage")
    }

    execute{
        var i: UInt64 = 0
        let pricePerMint = Bag.mintPrice

        while i < mintQty {
            let nft <- self.adminRef.mintReservedNFT(recipient: user)
            self.recipientCollectionRef.deposit(token: <- nft)
            i = i + 1
        }
    }
} 
`;

export async function mintReserve(user, mintQy) {
  try {
    const response = await fcl.mutate({
      cadence: RESERVE_MINT,
      args: (arg, t) => [arg(user, t.Address)],
      args: (arg, t) => [arg(mintQy, t.UFix64)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });
    const res = await fcl.tx(response).onceSealed();
    return res;
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
}
