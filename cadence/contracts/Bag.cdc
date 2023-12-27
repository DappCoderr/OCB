import NonFungibleToken from "./standard/NonFungibleToken.cdc"
import FungibleToken from "./standard/FungibleToken.cdc"
import Background from "./traits/Background.cdc"
import Types from "./traits/Type.cdc"
import Cloth from "./traits/Cloth.cdc"
import Weapon from "./traits/Weapon.cdc"
import Necklace from "./traits/Necklace.cdc"
import Ring from "./traits/Ring.cdc"
import Helmet from "./traits/Helmet.cdc"
import Rarity from "./traits/Rarity.cdc"

pub contract Bag: NonFungibleToken {

    // State Variable
    pub var totalSupply: UInt64
    pub var maxSupply: UInt64
    pub let bagPrice: UFix64
    pub var bagsRarityScore: {UInt64: UInt64} 

    // Event
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    // Storage and Public Paths
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath

    // The core resource that represents a Non Fungible Token.
    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64
        pub let svg: String

        init(id: UInt64,svg: String) 
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
        
    }

    pub resource interface ExampleNFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowExampleNFT(id: UInt64): &Bag.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow Bag reference: the ID of the returned reference is incorrect"
            }
        }
    }

    // The resource that will be holding the NFTs inside any account.
    pub resource Collection: ExampleNFTCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
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

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowExampleNFT(id: UInt64): &Bag.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &Bag.NFT
            }

            return nil
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

    pub fun mintNFT(): @Bag.NFT {
        pre {
            self.totalSupply != self.maxSupply : "There are no NFTs left."
            //vault.balance == Bag.bagPrice : "You don't have enough FLOW."
        }
        Bag.totalSupply = Bag.totalSupply + 1
        var svg = Bag.generateSVG()
        var newNFT <- create NFT(id: Bag.totalSupply,svg: svg)
        return <- newNFT
    }


    init() {
        self.totalSupply = 0
        self.maxSupply = 4444
        self.bagPrice = 30.0
        self.bagsRarityScore = {}

        self.CollectionStoragePath = /storage/exampleNFTCollection
        self.CollectionPublicPath = /public/exampleNFTCollection

        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        self.account.link<&Bag.Collection{NonFungibleToken.CollectionPublic, Bag.ExampleNFTCollectionPublic}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        emit ContractInitialized()
    }
}