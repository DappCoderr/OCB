import NonFungibleToken from "../../contracts/interface/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/interface/MetadataViews.cdc"
import Bag from "../../contracts/Bag.cdc"

transaction {

    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {
        
        let collectionData = Bag.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
            ?? panic("Could not resolve NFTCollectionData view. The Bag contract needs to implement the NFTCollectionData Metadata view in order to execute this transaction")

        if signer.storage.borrow<&Bag.Collection>(from: collectionData.storagePath) != nil {
            return
        }

        let collection <- Bag.createEmptyCollection(nftType: Type<@Bag.NFT>())

        signer.storage.save(<-collection, to: collectionData.storagePath)

        signer.capabilities.unpublish(collectionData.publicPath)
        let collectionCap = signer.capabilities.storage.issue<&Bag.Collection>(collectionData.storagePath)
        signer.capabilities.publish(collectionCap, at: collectionData.publicPath)
    }
}