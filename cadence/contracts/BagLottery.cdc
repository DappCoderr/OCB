import FungibleToken from "./interface/FungibleToken.cdc"
import FlowToken from "./interface/FlowToken.cdc"
import Bag from "./Bag.cdc"
import BagRegistry from "./BagRegistry.cdc"

access(all) contract BagLottery {

    access(all) event LotteryCreated(lotteryID: UInt64)
    access(all) event PrizePoolFunded(amount: UFix64)
    access(all) event LotteryResolvedAndPrizeDistributed(lotteryID: UInt64, nftId: UInt64, winnerAddress: Address, amount: UFix64)

    access(all) let AdminStoragePath: StoragePath

    access(all) var totalLottery: UInt64
    access(self) let lotteryVault: @FlowToken.Vault
    access(all) var winnerShare: UFix64
    access(all) var teamShare: UFix64

    /* --- Lottery Resource --- */
    access(all) resource Lottery {
        access(all) let id: UInt64
        access(all) var winnerNFTId: UInt64
        access(all) var winnings: UFix64
        access(all) var winnerAddress: Address?
        access(all) var isResolved: Bool
        access(all) var prizeDistributed: Bool
        
        init() {
            self.id = BagLottery.totalLottery
            self.winnerNFTId = 0
            self.winnings = 0.0
            self.winnerAddress = nil
            self.isResolved = false
            self.prizeDistributed = false
        }

        access(all) fun updateLotteryDetails(nftId: UInt64, address: Address, amount:UFix64) {
            pre {
                !self.isResolved: "Details are already set!!"
            }
            self.winnerNFTId = nftId
            self.winnerAddress = address
            self.winnings = amount
            self.prizeDistributed = true
        }

        access(all) fun markAsResolved() {
            self.isResolved = true
        }
    }

    access(all) resource Admin {
        access(all) let lotteries: @{UInt64: Lottery} 

        access(all) fun createLottery() {
            BagLottery.totalLottery = BagLottery.totalLottery + 1
            let newLottery <- create Lottery()
            emit LotteryCreated(lotteryID: newLottery.id)
            self.lotteries[newLottery.id] <-! newLottery
        }

        access(all) fun fundPrizePool(amount: @{FungibleToken.Vault}) {
            let fundedAmount = amount.balance
            BagLottery.lotteryVault.deposit(from: <- amount)
            emit PrizePoolFunded(amount: fundedAmount)
        }

        access(all) fun resolveLottery(lotteryID: UInt64, owner:Address) {
            let totalPrize = BagLottery.getLotteryVaultBalance()
            assert(totalPrize > 0.0, message: "Prize pool is empty")

            let lotteryRef = self.borrowLottery(lotteryID: lotteryID) 
                ?? panic("Lottery not found with ID: ".concat(lotteryID.toString()))
            
            assert(!lotteryRef.isResolved, message:"Lottery has already been resolved")

            // Resolve lottery
            let totalNFTs = BagLottery.getBagTotalSupply()

            // Get winning NFT
            let winner_NFT_Id = BagLottery.generateRandomNumber(upperBound: totalNFTs)  

            // Get winning NFT holder Address
            let registerAddress = Bag.registryAddress
            let registryRef = getAccount(registerAddress).contracts.borrow<&BagRegistry>(name: "BagRegistry") ?? panic("")
            let winnerAddress = registryRef.getHolder(bagId: winner_NFT_Id)!

            // Distribute prizes: 95% and 5%.
            // Bag Team 5% for development + marketing
            let bagTeamAmount = totalPrize * BagLottery.teamShare
            let bagTeamVault <- BagLottery.lotteryVault.withdraw(amount: bagTeamAmount)
            let bagTeamReceiver =  BagLottery.getFlowTokenReceiver(user:owner)
            bagTeamReceiver.deposit(from: <- bagTeamVault)

            // Winner         
            let winnerAmount = totalPrize
            let winnerVault <- BagLottery.lotteryVault.withdraw(amount: winnerAmount) 
            let winnerReceiver = BagLottery.getFlowTokenReceiver(user:winnerAddress)          
            winnerReceiver.deposit(from: <- winnerVault)
            
            lotteryRef.updateLotteryDetails(nftId: winner_NFT_Id, address: winnerAddress, amount:winnerAmount)
            lotteryRef.markAsResolved()

            emit LotteryResolvedAndPrizeDistributed(lotteryID: lotteryID, nftId: winner_NFT_Id, winnerAddress: winnerAddress, amount: winnerAmount)
        }

        access(all) fun borrowLottery(lotteryID: UInt64): &Lottery? {
            return &self.lotteries[lotteryID]
        }

        access(all) fun getAllLotteryIDs(): [UInt64] {
            return self.lotteries.keys
        }

        init() {
            self.lotteries <- {}
        }
    }

    access(all) fun borrowLottery(lotteryID: UInt64): &Lottery {
        return self.getAdmin().borrowLottery(lotteryID: lotteryID) 
            ?? panic("Lottery not found with ID: ".concat(lotteryID.toString()))
    }

    access(contract) fun getAdmin(): &Admin {
        return self.account.storage.borrow<&Admin>(from: self.AdminStoragePath)
            ?? panic("Could not borrow a reference to a Admin")
    }

    access(all) fun updateShare(teamShare:UFix64, winnerShare:UFix64){
        self.teamShare = teamShare
        self.winnerShare = winnerShare
    }
    
    access(self) fun generateRandomNumber(upperBound: UInt64): UInt64 {
        assert(upperBound > 0, message: "Upper bound must be greater than 0")
        let randomValue: UInt64 = revertibleRandom<UInt64>()
        let rand = randomValue % upperBound
        return rand == 0 ? 1 : rand
    }

    access(all) fun getAllLotteries(): [&BagLottery.Lottery]{
        let lotteryReferences: [&BagLottery.Lottery] = []
        let adminRef = self.getAdmin()
        let ids = adminRef.getAllLotteryIDs()
        for id in ids{
            lotteryReferences.append(self.borrowLottery(lotteryID: id))
        }
        return lotteryReferences
    }

    access(all) view fun getBagTotalSupply(): UInt64 {
        return Bag.totalSupply
    }

    access(all) view fun getLotteryVaultBalance(): UFix64{
        return BagLottery.lotteryVault.balance
    }

    access(all) fun getFlowTokenReceiver(user:Address): &{FungibleToken.Receiver}{
        return getAccount(user)
        .capabilities
        .borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver) 
        ?? panic("Could not borrow Bag Team Flow Token receiver reference")  
    }

    init() {
        self.totalLottery = 0
        self.lotteryVault <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>())
        self.AdminStoragePath = /storage/BagLotteryAdmin

        self.teamShare = 0.05
        self.winnerShare = 0.95

        let admin: @Admin <- create Admin()
        self.account.storage.save(<- admin, to: self.AdminStoragePath)
    }
}