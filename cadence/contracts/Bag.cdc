import NonFungibleToken from "./interface/NonFungibleToken.cdc"
import FungibleToken from "./interface/FungibleToken.cdc"
import FlowToken from "./interface/FlowToken.cdc"
import MetadataViews from "./interface/MetadataViews.cdc"
import ViewResolver from "./interface/ViewResolver.cdc"

import Base64Util from "./Base64Util.cdc"
import BagRegistry from "./BagRegistry.cdc"

import Background from "./components/Background.cdc"
import Body from "./components/Body.cdc"
import Cloth from "./components/Cloth.cdc"
import Weapon from "./components/Weapon.cdc"
import Glove from "./components/Glove.cdc"
import Ring from "./components/Ring.cdc"
import Helmet from "./components/Helmet.cdc"
import Rarity from "./components/Rarity.cdc"

access(all) contract Bag: NonFungibleToken, ViewResolver {

    /* --- Events --- */
    access(all) event ContractInitialized()
    access(all) event NFTWithdrawn(id: UInt64, from: Address?)
    access(all) event NFTDeposited(id: UInt64, to: Address?)
    access(all) event NFTMinted(id: UInt64, svg: String, mintedFor: Address)

    /* --- Storage Paths --- */
    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath
    access(all) let CollectionPrivatePath: PrivatePath
    access(all) let AdminStoragePath: StoragePath

    /* --- Contract State --- */
    access(all) var totalSupply: UInt64
    access(all) var maxSupply: UInt64
    access(all) var mintPrice: UFix64
    access(all) let reservedSupply: UInt64
    access(all) var reservedMinted: UInt64
    access(all) var traitsDetails: {UInt64: Bag.TraitsDetails}
    access(all) var bagRarityScores: {UInt64: UInt64} 
    access(all) var uniqueTraitsCombinations: [String]
    access(all) let registryAddress: Address
    access(self) let owner: Address
    

    access(all) struct TraitsDetails {
        access(all) var background: String
        access(all) var body: String
        access(all) var cloth: String
        access(all) var glove: String
        access(all) var helmet: String
        access(all) var ring: String
        access(all) var weapon: String

        init(background: String, body: String, cloth: String, glove: String, helmet: String, ring: String, weapon: String) {
            self.background = background
            self.body = body
            self.cloth = cloth
            self.glove = glove
            self.helmet = helmet
            self.ring = ring
            self.weapon = weapon
        }
    }

    access(all) resource NFT: NonFungibleToken.NFT {
        access(all) let id: UInt64
        access(all) let svg: String
        access(all) var winCount: UInt64
        access(all) var rarityScore: UInt64

        init(id: UInt64, svg: String, rarityScore: UInt64) {
            self.id = id
            self.svg = svg
            self.rarityScore = rarityScore
            self.winCount = 0
        }

        access(all) view fun getSVG(): String {
            return self.svg
        }

        access(all) view fun getWinCount(): UInt64 {
            return self.winCount
        }

        access(all) view fun getRarityScore(): UInt64 {
            return self.rarityScore
        }

        access(all) fun updateRarityScore(newScore: UInt64) {
            self.rarityScore = newScore
        }

        access(all) fun incrementWinCount() {
            self.winCount = self.winCount + 1
        }

        access(all) view fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.Traits>(),
                Type<MetadataViews.Royalties>(),
                Type<MetadataViews.NFTView>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>()
            ]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: "Bag # ".concat(self.id.toString()),
                        description: "Bag (OCB) is a fully on-chain GameFi asset built on the Flow blockchain, powered by Flow VRF randomness to ensure complete fairness. Each Bag contains 7 unique traits, forming a one-of-a-kind warrior identity. Bag is not just about art — every mint amount is staked into Flow nodes, generating real yield that flows back to holders. It's identity, utility, and rewards, all packed into a single Bag.",
                        thumbnail: MetadataViews.HTTPFile(url: self.getSVG())
                    ) 
                case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL("https://onchainbag.xyz")
                case Type<MetadataViews.Traits>():
                    return Bag.resolveNFTTraits(nftId: self.id)
                case Type<MetadataViews.Royalties>():
                    let owner = getAccount(Bag.owner)
                    let cut = MetadataViews.Royalty(
                        receiver: owner.capabilities.get<&{FungibleToken.Receiver}>(/public/dapperUtilityCoinReceiver),
                        cut: 0.05, // 5% royalty
                        description: "Creator Royalty"
                    )
                    var royalties: [MetadataViews.Royalty] = [cut]
                    return MetadataViews.Royalties(royalties)
                case Type<MetadataViews.NFTView>():
                    let display = self.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
                    let externalURL = self.resolveView(Type<MetadataViews.ExternalURL>())! as! MetadataViews.ExternalURL
                    let collectionData = Bag.resolveContractView(
                            resourceType: self.getType(),
                            viewType: Type<MetadataViews.NFTCollectionData>()
                        )! as! MetadataViews.NFTCollectionData
                    let collectionDisplay = Bag.resolveContractView(
                            resourceType: self.getType(),
                            viewType: Type<MetadataViews.NFTCollectionDisplay>()
                        )! as! MetadataViews.NFTCollectionDisplay
                    let royalties = self.resolveView(Type<MetadataViews.Royalties>())! as! MetadataViews.Royalties
                    let traits = self.resolveView(Type<MetadataViews.Traits>())! as! MetadataViews.Traits
                    return MetadataViews.NFTView(
                        id: self.id,
                        uuid: self.uuid,
                        display: display,
                        externalURL: externalURL,
                        collectionData: collectionData,
                        collectionDisplay: collectionDisplay,
                        royalties: royalties,
                        traits: traits
                    )
                case Type<MetadataViews.NFTCollectionData>():
                    return Bag.resolveContractView(resourceType: Type<@NFT>(), viewType: Type<MetadataViews.NFTCollectionData>())
                case Type<MetadataViews.NFTCollectionDisplay>():
                    return Bag.resolveContractView(resourceType: Type<@NFT>(), viewType: Type<MetadataViews.NFTCollectionDisplay>())
                default:
                    return nil
            } 
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <- Bag.createEmptyCollection(nftType: Type<@Bag.NFT>())
        }  
    }

    access(all) resource interface CollectionPublic {
        access(all) view fun getLength(): Int
        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}?
        access(all) view fun borrowViewResolver(id: UInt64): &{ViewResolver.Resolver}?
        access(all) fun forEachID(_ f: fun (UInt64): Bool): Void
        access(all) fun deposit(token: @{NonFungibleToken.NFT})
        access(all) fun borrowBagNFT(id: UInt64): &Bag.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow Bag reference: The ID of the returned reference is incorrect"
            }
        }
    }
    access(all) resource Collection: CollectionPublic, NonFungibleToken.Collection {
        access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}

        init() {
            self.ownedNFTs <- {}
        }

        access(NonFungibleToken.Withdraw) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
            pre {
                self.ownedNFTs.containsKey(withdrawID): 
                    "NFT with ID ".concat(withdrawID.toString()).concat(" not found in collection")
            }

            let owner = self.owner?.address!
            let token <- self.ownedNFTs.remove(key: withdrawID)!
            let id = token.id

            // Call BagRegistry to unregister holder
            if let ownerAddress = self.owner?.address {
                let registryRef = getAccount(Bag.registryAddress).contracts.borrow<&BagRegistry>(name: "BagRegistry")
                let _ = registryRef?.onNFTWithdrawn(bagId: id, from: owner)!
            }
            emit NFTWithdrawn(id: id, from: owner)
            return <- token
        }

        access(all) view fun getSupportedNFTTypes(): {Type: Bool} {
            return {Type<@Bag.NFT>(): true}
        }

        access(all) view fun isSupportedNFTType(type: Type): Bool {
            return self.getSupportedNFTTypes()[type] ?? false
        }

        access(all) fun deposit(token: @{NonFungibleToken.NFT}) {
            pre {
                self.isSupportedNFTType(type: token.getType()):
                    "Unsupported NFT type: ".concat(token.getType().identifier)
                self.ownedNFTs[token.id] == nil: 
                    "NFT with ID ".concat(token.id.toString()).concat(" already exists in collection")
            }
            
            let token <- token as! @Bag.NFT
            let id = token.id
            let existingToken <- self.ownedNFTs[id] <- token
            emit NFTDeposited(id: id, to: self.owner?.address)
            destroy existingToken
            // Call BagRegistry to register holder
            if let ownerAddress = self.owner?.address {
                let registryRef = getAccount(Bag.registryAddress).contracts.borrow<&BagRegistry>(name: "BagRegistry")
                let _ = registryRef?.onNFTDeposited(bagId: id, to: ownerAddress)!
            }
        }

        access(all) view fun getCollectionSize(): Int {
            return self.ownedNFTs.length
        }

        access(all) fun forEachNFTId(_ callback: fun (UInt64): Bool) {
            self.ownedNFTs.forEachKey(callback)
        }

        access(all) view fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}? {
            return &self.ownedNFTs[id]
        }

        access(all) fun borrowBagNFT(id: UInt64): &Bag.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as &{NonFungibleToken.NFT}?)!
                let bagNFT = ref as! &Bag.NFT
                return bagNFT
            }else{
                return nil
            }
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection}{ 
			return <- Bag.createEmptyCollection(nftType: Type<@Bag.NFT>())
		}
    }

    access(all) resource Admin {
        access(all) fun mintReservedNFT(recipient: Address): @Bag.NFT {
            pre {
                Bag.reservedSupply > Bag.reservedMinted: 
                    "No reserved NFTs available. Reserved supply: ".concat(Bag.reservedSupply.toString())
                recipient == Bag.owner: 
                    "Only contract owner can mint reserved NFTs"
            }
            
            Bag.totalSupply = Bag.totalSupply + 1
            Bag.reservedMinted = Bag.reservedMinted + 1
            
            let id = Bag.totalSupply
            let svg = Bag.createSVG()
            let rarityScore = Bag.bagRarityScores[id] 
                ?? panic("Rarity score not found for NFT ID: ".concat(id.toString()))
            
            var newNFT <- create NFT(id: id, svg: svg, rarityScore: rarityScore)
            emit NFTMinted(id: newNFT.id, svg: newNFT.svg, mintedFor: recipient)
            
            return <- newNFT
        }

        access(all) fun setMaxValue(newValue:UInt64){
            Bag.maxSupply = newValue
        }

        access(all) fun setMintPrice(newPrice:UFix64){
            Bag.mintPrice = newPrice
        }
    }

    access(all) fun createEmptyCollection(nftType: Type): @{NonFungibleToken.Collection} {
        return <- create Collection()
    }

    access(all) fun borrowNFT(ownerAddress: Address, nftId: UInt64): &Bag.NFT {
        let collectionRef = getAccount(ownerAddress)
            .capabilities
            .borrow<&Bag.Collection>(Bag.CollectionPublicPath)
            ?? panic("Cannot borrow collection reference from address: ".concat(ownerAddress.toString()))
        
        let nftRef = collectionRef.borrowBagNFT(id: nftId)
            ?? panic("NFT not found with ID: ".concat(nftId.toString()))
        
        return nftRef
    }

    access(self) fun getRandomBackground(): String {
        let index = Bag.generateRandomIndex(upperBound: Background.backgrounds.length)
        return Background.backgrounds[index]
    }

    access(self) fun getRandomBody(): String {
        let index = Bag.generateRandomIndex(upperBound: Body.body.length)
        return Body.body[index]
    }

    access(self) fun getRandomCloth(): String {
        let index = Bag.generateRandomIndex(upperBound: Cloth.cloths.length)
        return Cloth.cloths[index]
    }

    access(self) fun getRandomWeapon(): String {
        let index = Bag.generateRandomIndex(upperBound: Weapon.weapons.length)
        return Weapon.weapons[index]
    }

    access(self) fun getRandomGlove(): String {
        let index = Bag.generateRandomIndex(upperBound: Glove.gloves.length)
        return Glove.gloves[index]
    }

    access(self) fun getRandomRing(): String {
        let index = Bag.generateRandomIndex(upperBound: Ring.rings.length)
        return Ring.rings[index]
    }

    access(self) fun getRandomHelmet(): String {
        let index = Bag.generateRandomIndex(upperBound: Helmet.helmets.length)
        return Helmet.helmets[index]
    }

    access(self) fun generateRandomIndex(upperBound: Int): Int {
        assert(upperBound > 0, message: "Upper bound must be greater than 0")
        let randomValue: UInt64 = revertibleRandom<UInt64>()
        return Int(randomValue % UInt64(upperBound))
    }

    access(self) fun getRarityScoreValue(rarity: String): UInt64 {
        switch rarity {
            case "Common": return 1
            case "Rare": return 2
            case "Epic": return 3
            case "Legendary": return 5
            default: 
                panic("Unknown rarity type: ".concat(rarity))
        }
    }

    access(self) fun calculateRarityScore(itemName: String): UInt64 {
        let rarity = Rarity.rarity[itemName] ?? "Common"
        return Bag.getRarityScoreValue(rarity: rarity)
    }

    access(self) fun generateSVG(): String {
        var totalRarityScore: UInt64 = 0
        let bagId = Bag.totalSupply
        
        var svgContent = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'>"
        svgContent = svgContent.concat("<style>.bag { fill: white; font-family: serif; font-size: 14px; font-weight: bold} .base { fill: white; font-family: serif; font-size: 14px; } .title { fill: #ddd; font-family: Bookman; font-size: 10px; text-anchor: middle; }</style>")
        svgContent = svgContent.concat("<rect width='100%' height='100%' fill='black' />")
        svgContent = svgContent.concat("<text x='175' y='340' class='title'>build-on-flow</text>")
        svgContent = svgContent.concat("<text x='10' y='20' class='bag'>bag #".concat(bagId.toString()).concat("</text>"))
        
        var background: String = ""
        var body: String = ""
        var cloth: String = ""
        var weapon: String = ""
        var glove: String = ""
        var ring: String = ""
        var helmet: String = ""
        var traitsKey: String = ""
        
        var attempts = 0
        let maxAttempts = 100

        while attempts < maxAttempts {
            attempts = attempts + 1
            
            background = Bag.getRandomBackground()
            body = Bag.getRandomBody()
            cloth = Bag.getRandomCloth()
            weapon = Bag.getRandomWeapon()
            glove = Bag.getRandomGlove()
            ring = Bag.getRandomRing()
            helmet = Bag.getRandomHelmet()
            
            traitsKey = Bag.generateTraitsKey(
                background: background,
                body: body,
                cloth: cloth,
                weapon: weapon,
                glove: glove,
                ring: ring,
                helmet: helmet
            )
            
            if !self.uniqueTraitsCombinations.contains(traitsKey) {
                break
            }

            if attempts == maxAttempts {
                panic("Failed to generate unique traits combination after ".concat(maxAttempts.toString()).concat(" attempts"))
            }
        }
        
        self.uniqueTraitsCombinations.append(traitsKey)
        
        // Add traits to SVG
        let traits = [background, body, cloth, weapon, glove, ring, helmet]
        var yPosition = 60
        
        for trait in traits {
            svgContent = svgContent.concat("<text x='10' y='".concat(yPosition.toString()).concat("' class='base'>").concat(trait).concat("</text>"))
            yPosition = yPosition +  20
            totalRarityScore = totalRarityScore + self.calculateRarityScore(itemName: trait)
        }
        
        // Store traits details
        self.traitsDetails[bagId] = Bag.TraitsDetails(background:background, body:body, cloth:cloth, glove:glove, helmet:helmet, ring:ring, weapon:weapon)
        self.bagRarityScores[bagId] = totalRarityScore
        
        // Add rarity score
        svgContent = svgContent.concat("<text x='10' y='250' class='base'>rarity score: ".concat(totalRarityScore.toString()).concat("</text>"))
        svgContent = svgContent.concat("</svg>")
        
        return svgContent
    }

    access(self) fun generateTraitsKey(background: String, body: String, cloth: String, weapon: String, glove: String, ring: String, helmet: String): String {
        return background.concat("|")
            .concat(body).concat("|")
            .concat(cloth).concat("|")
            .concat(weapon).concat("|")
            .concat(glove).concat("|")
            .concat(ring).concat("|")
            .concat(helmet)
    }

    access(self) fun createSVG(): String {
        let svgImage = Bag.generateSVG()
        let base64SVG = Base64Util.encode(svgImage)
        return "data:image/svg+xml;base64,".concat(base64SVG)
    }

    access(all) fun mintNFT(user:Address, payment: @FlowToken.Vault): @Bag.NFT {
        pre {
            self.totalSupply < (self.maxSupply - self.reservedSupply): 
                "Maximum supply reached. Total supply: ".concat(self.totalSupply.toString())
            payment.balance >= self.mintPrice: 
                "Insufficient payment. Required: ".concat(self.mintPrice.toString()).concat(", Provided: ").concat(payment.balance.toString())
            self.getCollectionLength(user: user) < 20 : "Maximum 20 Bag per account"
        }
        
        let contractReceiver = self.account.capabilities
            .borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            ?? panic("Contract Flow token receiver capability not found")
        
        contractReceiver.deposit(from: <- payment)
        
        Bag.totalSupply = Bag.totalSupply + 1
        let id = Bag.totalSupply
        let svg = Bag.createSVG()

        let rarityScore = self.bagRarityScores[id] ?? panic("Rarity score not found for NFT ID: ".concat(id.toString()))
        
        var newNFT <- create NFT(id: id, svg: svg, rarityScore: rarityScore)
        emit NFTMinted(id: newNFT.id, svg: newNFT.svg, mintedFor:user)
        
        return <- newNFT
    }

    access(all) fun resolveNFTTraits(nftId: UInt64): MetadataViews.Traits? {
        if let traits = self.traitsDetails[nftId] {
            let metadata: {String: AnyStruct} = {
                "Background": traits.background,
                "Body": traits.body,
                "Cloth": traits.cloth,
                "Glove": traits.glove,
                "Helmet": traits.helmet,
                "Ring": traits.ring,
                "Weapon": traits.weapon
            }
            return MetadataViews.dictToTraits(dict: metadata, excludedNames: [])
        }
        return nil
    }

    access(all) view fun getContractViews(resourceType: Type?): [Type] {
        return [
            Type<MetadataViews.NFTCollectionData>(),
            Type<MetadataViews.NFTCollectionDisplay>(),
            Type<MetadataViews.Royalties>()
        ]
    }
    
    access(all) fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
        switch viewType {
            case Type<MetadataViews.NFTCollectionData>():
                return MetadataViews.NFTCollectionData(
                    storagePath: Bag.CollectionStoragePath,
                    publicPath: Bag.CollectionPublicPath,
                    publicCollection: Type<&Collection>(),
                    publicLinkedType: Type<&Collection>(),
                    createEmptyCollectionFunction: (fun(): @{NonFungibleToken.Collection} {
                        return <-Bag.createEmptyCollection(nftType: Type<@Bag.NFT>())
                    })
                )
            case Type<MetadataViews.NFTCollectionDisplay>():
				let media = MetadataViews.Media(
					file: MetadataViews.HTTPFile(
						url: "https://white-worldwide-unicorn-392.mypinata.cloud/ipfs/bafybeigeadg24nqk5vuxjrcuv7w5p6ujxtzv3rilpigwh3c5wbmk2utyva"
					),
					mediaType: "image/png"
				)
				let mediaBanner = MetadataViews.Media(
					file: MetadataViews.HTTPFile(
						url: "https://white-worldwide-unicorn-392.mypinata.cloud/ipfs/bafybeihoztqdrbkkdmb3jmo7yrx4kdcamq7hr5ohsuq3ks3kmpfo3yrwxm"
					),
					mediaType: "image/png"
				)
				return MetadataViews.NFTCollectionDisplay(
					name: "Bag Collection",
					description: "Own a Bag & get the chance to win weekly rewards and more",
					externalURL: MetadataViews.ExternalURL("https://onchainbag.xyz"),
					squareImage: media,
					bannerImage: mediaBanner,
					socials: {"twitter": MetadataViews.ExternalURL("https://x.com/onchainbag")}
				)
            case Type<MetadataViews.Royalties>():
                    return MetadataViews.Royalties([])
                default:
                    return nil
        }
    }

    /* --- View Functions --- */
    access(all) view fun getFlowBalance(): UFix64 {
        let vaultRef = self.account.capabilities
            .borrow<&FlowToken.Vault>(/public/flowTokenBalance)
            ?? panic("Flow token vault not found at /public/flowTokenBalance")
        
        return vaultRef.balance
    }

    access(all) view fun getMintPrice(): UFix64 {
        return self.mintPrice
    }

    access(all) view fun getTotalSupply(): UInt64 {
        return self.totalSupply
    }

    access(all) view fun getMaxSupply(): UInt64 {
        return self.maxSupply
    }

    access(all) view fun getReservedSupply(): UInt64 {
        return self.reservedSupply
    }

    access(all) view fun getReservedMinted(): UInt64 {
        return self.reservedMinted
    }

    access(all) view fun getTraitsDetails(nftId: UInt64): Bag.TraitsDetails? {
        return self.traitsDetails[nftId]
    }

    access(all) view fun getBagRarityScore(nftId: UInt64): UInt64? {
        return self.bagRarityScores[nftId]
    }

    access(all) view fun hasCollection(user: Address): Bool {
        let account = getAccount(user)
        return account.capabilities.get<&Bag.Collection>(Bag.CollectionPublicPath).check()
    }

    access(all) view fun getCollectionRef(user:Address): &Bag.Collection{
        return getAccount(user).capabilities.get<&Bag.Collection>(Bag.CollectionPublicPath).borrow()?? panic("Cannot borrow collection reference")
    }

    access(all) view fun getCollectionLength(user: Address): Int {
        pre {
            self.hasCollection(user: user): "User does not have a Bag collection"
        }

        return self.getCollectionRef(user:user).getIDs().length
    }

    access(all) view fun getCollectionNFTIds(user: Address): [UInt64] {
        pre {
            self.hasCollection(user: user): 
                "User does not have a Bag collection"
        } 
        
        return self.getCollectionRef(user:user).getIDs()
    }

    access(all) fun getNFTWinCount(ownerAddress: Address, nftId: UInt64): UInt64 {
        let nft = Bag.borrowNFT(ownerAddress: ownerAddress, nftId: nftId)
        return nft.winCount
    }

    access(all) fun getNFTRarityScore(ownerAddress: Address, nftId: UInt64): UInt64 {
        let nft = Bag.borrowNFT(ownerAddress: ownerAddress, nftId: nftId)
        return nft.rarityScore
    }

    init(owner: Address, mintPrice:UFix64, reserveSupply:UInt64, registryAddress:Address) {
        self.totalSupply = 0
        self.maxSupply = 7777
        self.mintPrice = mintPrice
        self.traitsDetails = {}
        self.bagRarityScores = {}
        self.uniqueTraitsCombinations = []

        self.owner = owner
        self.registryAddress = registryAddress
        self.reservedSupply = reserveSupply
        self.reservedMinted = 0

        self.CollectionStoragePath = /storage/BagCollection
        self.CollectionPublicPath = /public/BagCollectionPublic
        self.CollectionPrivatePath = /private/BagCollectionProvider
        self.AdminStoragePath = /storage/BagAdmin

        let collection <- create Collection()
        self.account.storage.save(<- collection, to: self.CollectionStoragePath)

        let admin <- create Admin()
        self.account.storage.save(<- admin, to: self.AdminStoragePath)

        let collectionCapability = self.account.capabilities.storage
            .issue<&Bag.Collection>(Bag.CollectionStoragePath)
        self.account.capabilities.publish(collectionCapability, at: self.CollectionPublicPath)

        emit ContractInitialized()
    }
}