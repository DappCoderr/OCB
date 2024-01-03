import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import MetadataViews from 0x631e88ae7f1d7c20
import ViewResolver from 0x631e88ae7f1d7c20
import Background from 0x07106009be51ec25
import Types from 0x07106009be51ec25
import Cloth from 0x07106009be51ec25
import Weapon from 0x07106009be51ec25
import Necklace from 0x07106009be51ec25
import Ring from 0x07106009be51ec25
import Helmet from 0x07106009be51ec25
import Rarity from 0x07106009be51ec25
import Base64 from 0x07106009be51ec25

pub contract Bag: NonFungibleToken, ViewResolver {

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Minted(id: UInt64, svg:String)

    // Storage and Public Paths
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath

    // State Variable
    pub var totalSupply: UInt64
    pub var maxSupply: UInt64
    pub let bagPrice: UFix64

    pub var bagsRarityScore: {UInt64: UInt64} 

    // The core resource that represents a Non Fungible Token.
    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let svg: String

        init(id: UInt64, svg: String) 
        {
            self.id = id
            self.svg = svg
        }

        pub fun getRarityScore(id:UInt64): UInt64?{
            return Bag.bagsRarityScore[id]
        }

        pub fun getSVG(): String{
            return self.svg
        }

        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Editions>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Royalties>(),
                Type<MetadataViews.Traits>()
            ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            // Note: This needs to be changed for each environment before deployment
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: "Bag # ".concat(self.id.toString()),
                        description: "The on-chain randomized bag utilizes flow VRF to generate unique characters.",
                        thumbnail: MetadataViews.HTTPFile(url: self.getSVG()
                            //url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHByZXNlcnZlQXNwZWN0UmF0aW89J3hNaW5ZTWluIG1lZXQnIHZpZXdCb3g9JzAgMCAzNTAgMzUwJz48c3R5bGU+LmJhZyB7IGZpbGw6IHdoaXRlOyBmb250LWZhbWlseTogc2VyaWY7IGZvbnQtc2l6ZTogMTRweDsgZm9udC13ZWlnaHQ6IGJvbGR9IC5iYXNlIHsgZmlsbDogd2hpdGU7IGZvbnQtZmFtaWx5OiBzZXJpZjsgZm9udC1zaXplOiAxNHB4OyB9IC50aXRsZSB7IGZpbGw6ICNkZGQ7IGZvbnQtZmFtaWx5OiBCb29rbWFuOyBmb250LXNpemU6IDEwcHg7IHRleHQtYW5jaG9yOiBtaWRkbGU7IH08L3N0eWxlPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9J2JsYWNrJyAvPjx0ZXh0IHg9JzE3NScgeT0nMzQwJyBjbGFzcz0ndGl0bGUnPmJ1aWxkLW9uLWZsb3c8L3RleHQ+PHRleHQgeD0nMTAnIHk9JzIwJyBjbGFzcz0nYmFnJz5iYWcgIzY8L3RleHQ+PHRleHQgeD0nMTAnIHk9JzYwJyBjbGFzcz0nYmFzZSc+VGVhbCBTZXJlbml0eTwvdGV4dD48dGV4dCB4PScxMCcgeT0nODAnIGNsYXNzPSdiYXNlJz5JbmZlY3RlZCBTdXJ2aXZvcjwvdGV4dD48dGV4dCB4PScxMCcgeT0nMTAwJyBjbGFzcz0nYmFzZSc+UmFkaWF0aW9uLVByb29mIEp1bXBzdWl0PC90ZXh0Pjx0ZXh0IHg9JzEwJyB5PScxMjAnIGNsYXNzPSdiYXNlJz5CbGF6ZTwvdGV4dD48dGV4dCB4PScxMCcgeT0nMTQwJyBjbGFzcz0nYmFzZSc+QW11bGV0PC90ZXh0Pjx0ZXh0IHg9JzEwJyB5PScxNjAnIGNsYXNzPSdiYXNlJz5Hb2xkIFJpbmc8L3RleHQ+PHRleHQgeD0nMTAnIHk9JzE4MCcgY2xhc3M9J2Jhc2UnPlBvd2VyIEFybW9yIEhlbG1ldDwvdGV4dD48dGV4dCB4PScxMCcgeT0nMjUwJyBjbGFzcz0nYmFzZSc+cmFyaXR5IHNjb3JlOiAxNjwvdGV4dD48L3N2Zz4K"
                        )
                    )

                case Type<MetadataViews.Edition>():
                    return MetadataViews.Edition(
                      name: "Bag",
                      number: self.id,
                      max: Bag.maxSupply
                    )

                case Type<MetadataViews.Editions>():
                    let editionInfo = MetadataViews.Edition(name: "Bag Edition", number: self.id, max: Bag.maxSupply)
                    let editionList: [MetadataViews.Edition] = [editionInfo]
                    return MetadataViews.Editions(
                        editionList
                    )

                case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL(
                            url: "https://xyz.io/"
                    )

                case Type<MetadataViews.NFTCollectionData>():
                    return MetadataViews.NFTCollectionData(
                        storagePath: Bag.CollectionStoragePath,
                        publicPath: Bag.CollectionPublicPath,
                        providerPath: /private/BagNFTCollection,
                        publicCollection: Type<&Bag.Collection{Bag.BagNFTCollectionPulbic}>(),
                        publicLinkedType: Type<&Bag.Collection{Bag.BagNFTCollectionPulbic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
                        providerLinkedType: Type<&Bag.Collection{Bag.BagNFTCollectionPulbic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
                        createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                            return <-Bag.createEmptyCollection()
                        })
                    )

                case Type<MetadataViews.NFTCollectionDisplay>():
                    let media = MetadataViews.Media(
                                    file: MetadataViews.HTTPFile(
                                    url: "https://storage/123.png"
                                ),
                                mediaType: "image/png"
                                )
                    return MetadataViews.NFTCollectionDisplay(
                        name: "Bag",
                        description: "The on-chain randomized bag utilizes flow VRF to generate unique characters.",
                        externalURL: MetadataViews.ExternalURL("https://p.io/"),
                        squareImage: media,
                        bannerImage: media,
                        socials: {
                            "twitter": MetadataViews.ExternalURL("https://twitter.com/d")
                        }
                    )

                case Type<MetadataViews.Royalties>():
                    let merchant = getAccount(0xf1d3e3f8e9788ea7)
                    return MetadataViews.Royalties(
                            cutInfos: [
                                MetadataViews.Royalty(
                                    recepient: merchant.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver),
                                    cut: 0.01,
                                    description: "Bag creator royalty in Flow Token",
                                )
                            ]
                )

                case Type<MetadataViews.Serial>():
                    return MetadataViews.Serial(
                        self.id
                )
            }

            return nil
        }  
    }
    pub resource interface BagNFTCollectionPulbic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowBagNFT(id: UInt64): &Bag.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow Bag reference: The ID of the returned reference is incorrect"
            }
        }
    }
    pub resource Collection: BagNFTCollectionPulbic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        destroy() {
            destroy self.ownedNFTs
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <-token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @Bag.NFT
            let id: UInt64 = token.id
            let oldToken <- self.ownedNFTs[id] <- token
            emit Deposit(id: id, to: self.owner?.address)
            destroy oldToken
        }

        pub fun batchDeposit(collection: @Collection) {
            let keys = collection.getIDs()
            for key in keys {
                self.deposit(token: <-collection.withdraw(withdrawID: key))
            }
            destroy collection
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowBagNFT(id: UInt64): &Bag.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &Bag.NFT
            }
            return nil
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let bagNFT = ref as! &Bag.NFT
            return bagNFT as &AnyResource{MetadataViews.Resolver}
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub fun getRandomBackground(): String{
        let size = Background.backgrounds.length
        let sizes = UInt64(size)
        let rand = Bag.getRandomNumber(num: sizes)
        return Background.backgrounds[rand]
    }

    pub fun getRandomTypes(): String{
        let size = Types.types.length
        let sizes = UInt64(size)
        let rand = Bag.getRandomNumber(num: sizes)
        return Types.types[rand]
    }

    pub fun getRandomCloth(): String{
        let size = Cloth.cloths.length
        let sizes = UInt64(size)
        let rand = Bag.getRandomNumber(num: sizes)
        return Cloth.cloths[rand]
    }

    pub fun getRandomWeapons(): String{
        let size = Weapon.weapons.length
        let sizes = UInt64(size)
        let rand = Bag.getRandomNumber(num: sizes)
        return Weapon.weapons[rand]
    }

    pub fun getRandomNecklace(): String{
        let size = Necklace.necklace.length
        let sizes = UInt64(size)
        let rand = Bag.getRandomNumber(num: sizes)
        return Necklace.necklace[rand]
    }

    pub fun getRandomRing(): String{
        let size = Ring.rings.length
        let sizes = UInt64(size)
        let rand = Bag.getRandomNumber(num: sizes)
        return Ring.rings[rand]
    }

    pub fun getRandomHelmet(): String{
        let size = Helmet.helmets.length
        let sizes = UInt64(size)
        let rand = Bag.getRandomNumber(num: sizes)
        return Helmet.helmets[rand]
    }

    pub fun getRandomNumber(num: UInt64): UInt64 {
        let randomNumber: UInt64 = revertibleRandom()
        let moduloResult = randomNumber % num
        return moduloResult == 0 ? 0 : moduloResult - 1
    }

    access(contract) fun getRarityScore(rarity:String): UInt64{
        switch rarity {
        case "Common":
            return 1
        case "Rare":
            return 2
        case "Epic":
            return 3
        case "Legendary":
            return 5
        default:
            return 0
        }
    }

    access(contract) fun calculateRarityScore(itemName: String): UInt64 {
        let rarity = Rarity.rarity[itemName] ?? "Common"
        var value = Bag.getRarityScore(rarity : rarity)
        return value
    }

    access(contract) fun generateSVG(): String{
        var totalRarityScore: UInt64 = 0
        var svg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.bag { fill: white; font-family: serif; font-size: 14px; font-weight: bold} .base { fill: white; font-family: serif; font-size: 14px; } .title { fill: #ddd; font-family: Bookman; font-size: 10px; text-anchor: middle; }</style><rect width='100%' height='100%' fill='black' /><text x='175' y='340' class='title'>build-on-flow</text><text x='10' y='20' class='bag'>"
        var bagName = "bag #"
        svg = svg.concat(bagName)
        var bagId = Bag.totalSupply
        svg = svg.concat(bagId.toString()).concat("</text>").concat("<text x='10' y='60' class='base'>")
        let background = Bag.getRandomBackground()
        svg = svg.concat(background).concat("</text>")
        svg = svg.concat("<text x='10' y='80' class='base'>")
        let type = Bag.getRandomTypes()
        svg = svg.concat(type).concat("</text>")
        svg = svg.concat("<text x='10' y='100' class='base'>")
        let cloth = Bag.getRandomCloth()
        svg = svg.concat(cloth).concat("</text>")
        svg = svg.concat("<text x='10' y='120' class='base'>")
        let weapon = Bag.getRandomWeapons()
        svg = svg.concat(weapon).concat("</text>")
        svg = svg.concat("<text x='10' y='140' class='base'>")
        let necklace = Bag.getRandomNecklace()
        svg = svg.concat(necklace).concat("</text>")
        svg = svg.concat("<text x='10' y='160' class='base'>")
        let ring = Bag.getRandomRing()
        svg = svg.concat(ring).concat("</text>")
        svg = svg.concat("<text x='10' y='180' class='base'>")
        let helmet = Bag.getRandomHelmet()
        svg = svg.concat(helmet).concat("</text>")
        svg = svg.concat("<text x='10' y='250' class='base'>")
        let items = [background, type, cloth, weapon, necklace, ring, helmet]
        for item in items {
            totalRarityScore = totalRarityScore + self.calculateRarityScore(itemName: item)
        }
        self.bagsRarityScore[bagId] = totalRarityScore
        svg = svg.concat("rarity score: ").concat(totalRarityScore.toString()).concat("</text>")
        svg = svg.concat("</svg>")
        return svg
    }

    pub fun mintNFT(payment: @FlowToken.Vault): @Bag.NFT {
        pre {
            self.totalSupply != self.maxSupply : "There are no NFTs left."
            payment.balance == Bag.bagPrice : "You don't have enough FLOW."
        }
        let contractReceiverRef: &FlowToken.Vault{FungibleToken.Receiver} = Bag.account.getCapability(/public/flowTokenReceiver).borrow<&FlowToken.Vault{FungibleToken.Receiver}>()!
        contractReceiverRef.deposit(from: <- payment)
        Bag.totalSupply = Bag.totalSupply + 1
        var image = Bag.generateSVG()
        var svgToBase64 = Bag.convertSVG(url: image)
        var newSVG = "data:image/svg+xml;base64,".concat(svgToBase64)
        var newNFT <- create NFT(id: Bag.totalSupply,svg: newSVG)
        emit Minted(id: newNFT.id, svg: newNFT.svg)
        return <- newNFT
    }

    pub fun convertStringToBytes(input: String): [UInt8] {
        return input.utf8
    }

    pub fun convertSVG(url:String): String {
        var image = Bag.convertStringToBytes(input: url)
        return Base64.encode(data: image)
    }
    
    pub fun getViews(): [Type] {
        return [
            Type<MetadataViews.ExternalURL>(),
            Type<MetadataViews.NFTCollectionData>(),
            Type<MetadataViews.NFTCollectionDisplay>()
        ]
    }

        pub fun resolveView(_ view: Type): AnyStruct? {
        switch view {
            case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL(
                            url: "https://xyz.io/"
                    )

                case Type<MetadataViews.NFTCollectionData>():
                    return MetadataViews.NFTCollectionData(
                        storagePath: Bag.CollectionStoragePath,
                        publicPath: Bag.CollectionPublicPath,
                        providerPath: /private/BagNFTCollection,
                        publicCollection: Type<&Bag.Collection{Bag.BagNFTCollectionPulbic}>(),
                        publicLinkedType: Type<&Bag.Collection{Bag.BagNFTCollectionPulbic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
                        providerLinkedType: Type<&Bag.Collection{Bag.BagNFTCollectionPulbic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
                        createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                            return <-Bag.createEmptyCollection()
                        })
                    )

                case Type<MetadataViews.NFTCollectionDisplay>():
                    let media = MetadataViews.Media(
                                    file: MetadataViews.HTTPFile(
                                    url: "https://storage/123.png"
                                ),
                                mediaType: "image/png"
                                )
                    return MetadataViews.NFTCollectionDisplay(
                        name: "Bag",
                        description: "The on-chain randomized bag utilizes flow VRF to generate unique characters.",
                        externalURL: MetadataViews.ExternalURL("https://p.io/"),
                        squareImage: media,
                        bannerImage: media,
                        socials: {
                            "twitter": MetadataViews.ExternalURL("https://twitter.com/d")
                        }
                    )
        }
        return nil
    }

    init() {
        self.totalSupply = 0
        self.maxSupply = 4444
        self.bagPrice = 30.0
        self.bagsRarityScore = {}

        self.CollectionStoragePath = /storage/BagNFTCollection
        self.CollectionPublicPath = /public/BagNFTCollection

        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        self.account.link<&Bag.Collection{NonFungibleToken.CollectionPublic, Bag.BagNFTCollectionPulbic}>(self.CollectionPublicPath,target: self.CollectionStoragePath)

        emit ContractInitialized()
    }
}