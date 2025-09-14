import NonFungibleToken from "../../contracts/interface/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/interface/MetadataViews.cdc"

/// @param to: The address to transfer the token to
/// @param id: The id of token to transfer
/// @param nftTypeIdentifier: The type identifier name of the NFT type you want to transfer
            /// Ex: "A.0b2a3299cc857e29.TopShot.NFT"

transaction(to: Address, id: UInt64, nftTypeIdentifier: String) {

    let tempNFT: @{NonFungibleToken.NFT}

    let collectionData: MetadataViews.NFTCollectionData

    prepare(signer: auth(BorrowValue) &Account) {

        self.collectionData = MetadataViews.resolveContractViewFromTypeIdentifier(
            resourceTypeIdentifier: nftTypeIdentifier,
            viewType: Type<MetadataViews.NFTCollectionData>()
        ) as? MetadataViews.NFTCollectionData
            ?? panic("Could not construct valid NFT type and view from identifier \(nftTypeIdentifier)")

        let withdrawRef = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Collection}>(
                from: self.collectionData.storagePath
            ) ?? panic("The signer does not store a NFT Collection object at the path \(self.collectionData.storagePath)"
                        .concat("The signer must initialize their account with this collection first!"))

        self.tempNFT <- withdrawRef.withdraw(withdrawID: id)

        assert(
            self.tempNFT.getType().identifier == nftTypeIdentifier,
            message: "The NFT that was withdrawn to transfer is not the type that was requested <\(nftTypeIdentifier)>."
        )
    }

    execute {
        let recipient = getAccount(to)

        let receiverRef = recipient.capabilities.borrow<&{NonFungibleToken.Receiver}>(self.collectionData.publicPath)
            ?? panic("The recipient does not have a NonFungibleToken Receiver at \(self.collectionData.publicPath.toString())"
                        .concat(" that is capable of receiving a \(nftTypeIdentifier)."))

        receiverRef.deposit(token: <-self.tempNFT)
    }
}