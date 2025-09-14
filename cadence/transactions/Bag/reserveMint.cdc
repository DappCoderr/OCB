import FungibleToken from "../../contracts/interface/FungibleToken.cdc"
import FlowToken from "../../contracts/interface/FlowToken.cdc"
import NonFungibleToken from "../../contracts/interface/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/interface/MetadataViews.cdc"
import Bag from "../../contracts/Bag.cdc"

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