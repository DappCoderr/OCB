import FungibleToken from "./interface/FungibleToken.cdc"
import FlowToken from "./interface/FlowToken.cdc"
import Bag from "./Bag.cdc"

access(all) contract BagLottery {

    access(all) var totalLottery: UInt64
    access(self) let lotteryVault: @FlowToken.Vault

    access(all) event LotteryCreated(lotteryID: UInt64)
    access(all) event PrizePoolFunded(amount: UFix64)
    access(all) event LotteryResolved(lotteryID: UInt64, NFTId: UInt64)
    access(all) event PrizeClaimed(lotteryID: UInt64, winnerAddress: Address, amount: UFix64)

    access(all) let AdminStoragePath: StoragePath

    access(all) resource Lottery {
        access(all) let id: UInt64
        access(all) var winner_NFTId: UInt64
        access(all) var prizeVault: @FlowToken.Vault
        access(all) var winnerAddress: Address
        access(all) var isResolved: Bool
        access(all) var prizeClaimed: Bool

        init() {
            self.id = BagLottery.totalLottery
            self.winner_NFTId = 0
            self.prizeVault <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>())
            self.winnerAddress = 0x0
            self.isResolved = false
            self.prizeClaimed = false
        }

        access(all) fun setWinnerNFTId(newNFTId: UInt64) {
            self.winner_NFTId = newNFTId
        }

        access(all) fun setWinnerAddress(winnerAddress: Address) {
            self.winnerAddress = winnerAddress
        }

        access(all) fun markAsResolved() {
            self.isResolved = true
        }

        access(all) fun claimPrize(winnerAddress: Address) {
            pre {
                self.prizeVault.balance > 0.0: "No prize available to claim"
                !self.prizeClaimed : "Prize claimed already"
            }
            
            let prizeAmount = self.prizeVault.balance
            let prizeVault <- self.prizeVault.withdraw(amount: prizeAmount)
            
            let winnerReceiver = getAccount(winnerAddress)
                .capabilities
                .borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver) 
                ?? panic("Could not borrow Flow token receiver reference")
            
            winnerReceiver.deposit(from: <- prizeVault)
            self.setWinnerAddress(winnerAddress: winnerAddress)
            self.prizeClaimed = true
            let bagNFT = Bag.borrowNFT(ownerAddress: winnerAddress, nftId: self.winner_NFTId)
            bagNFT.incrementWinCount()
            
            emit PrizeClaimed(lotteryID: self.id, winnerAddress: winnerAddress, amount: prizeAmount)
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
            let totalPrize = BagLottery.lotteryVault.balance
            
            assert(totalPrize > 0.0, message: "Prize pool is empty")

            let lotteryRef = self.borrowLottery(lotteryID: lotteryID) 
                ?? panic("Lottery not found with ID: ".concat(lotteryID.toString()))
            
            assert(!lotteryRef.isResolved, message:"Lottery has already been resolved")

            let totalNFTs = BagLottery.getBagTotalSupply()
            let winner_NFTId = BagLottery.generateRandomNumber(upperBound: totalNFTs)
            
            lotteryRef.setWinnerNFTId(newNFTId: winner_NFTId)

            // Distribute prizes: 80% to winner, 20% to bag team
            let winnerPrizeAmount = totalPrize * 0.85
            let winnerPrize <- BagLottery.lotteryVault.withdraw(amount: winnerPrizeAmount) 
            // Deposit winner's prize into lottery prize vault
            lotteryRef.prizeVault.deposit(from: <- winnerPrize)

            let bagTeamAmount = BagLottery.lotteryVault.balance
            let bagTeamPrize <- BagLottery.lotteryVault.withdraw(amount: bagTeamAmount)
            
            // Deposit owner share
            let bagTeamReceiver = getAccount(owner)
                .capabilities
                .borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver) 
                ?? panic("Could not borrow bag team receiver reference")
            
            bagTeamReceiver.deposit(from: <- bagTeamPrize)
            
            lotteryRef.markAsResolved()

            emit LotteryResolved(lotteryID: lotteryID, NFTId: winner_NFTId)
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

    access(all) fun claimPrize(claimerAddress: Address, lotteryID: UInt64) {
        let lottery = self.borrowLottery(lotteryID: lotteryID)
        
        assert(lottery.isResolved, message: "Lottery has not been resolved yet")

        let userNFTIds = Bag.getCollectionSize(user: claimerAddress)
        let winner_NFTId = lottery.winner_NFTId
        
        // Check if claimant owns the winning NFT
        assert(userNFTIds.contains(winner_NFTId), message: "Claimer does not own the winning NFT")
        
        lottery.claimPrize(winnerAddress: claimerAddress)
    }
    
    access(self) fun generateRandomNumber(upperBound: UInt64): UInt64 {
        assert(upperBound > 0, message: "Upper bound must be greater than 0")
        let randomValue: UInt64 = revertibleRandom<UInt64>()
        return randomValue % upperBound
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

    init() {
        self.totalLottery = 0
        self.lotteryVault <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>())
        self.AdminStoragePath = /storage/BagLotteryAdmin

        let admin: @Admin <- create Admin()
        self.account.storage.save(<- admin, to: self.AdminStoragePath)
    }
}