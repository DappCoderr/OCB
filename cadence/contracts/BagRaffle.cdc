import FungibleToken from "./interface/FungibleToken.cdc"
import FlowToken from "./interface/FlowToken.cdc"
import TestBag from "./TestBag.cdc"

access(all) contract BagRaffle {

    access(all) var totalRaffles: UInt64
    access(self) let prizePoolVault: @FlowToken.Vault

    access(all) event RaffleCreated(raffleId: UInt64)
    access(all) event PrizePoolFunded(amount: UFix64)
    access(all) event RaffleResolved(raffleId: UInt64, winnerNftId: UInt64)
    access(all) event PrizeClaimed(raffleId: UInt64, winnerAddress: Address, amount: UFix64)

    access(all) let AdminStoragePath: StoragePath

    access(all) resource Raffle {
        access(all) let id: UInt64
        access(all) var winningNftId: UInt64
        access(all) var prizeVault: @FlowToken.Vault
        access(all) var winnerAddress: Address
        access(all) var isResolved: Bool
        access(all) var prizeClaimed: Bool

        init() {
            self.id = BagRaffle.totalRaffles
            self.winningNftId = 0
            self.prizeVault <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>())
            self.winnerAddress = 0x0
            self.isResolved = false
            self.prizeClaimed = false
        }

        access(all) fun setWinningNftId(newNftId: UInt64) {
            self.winningNftId = newNftId
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
                self.prizeClaimed == true: "Prize claimed already"
            }
            
            let prizeAmount = self.prizeVault.balance
            let prizeVault <- self.prizeVault.withdraw(amount: prizeAmount)
            
            let winnerReceiver = getAccount(winnerAddress)
                .capabilities
                .borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver) 
                ?? panic("Could not borrow Flow token receiver reference")
            
            winnerReceiver.deposit(from: <- prizeVault)

            self.prizeClaimed = true
            
            emit PrizeClaimed(raffleId: self.id, winnerAddress: winnerAddress, amount: prizeAmount)
        }
    }

    access(all) resource Admin {
        access(all) let raffles: @{UInt64: Raffle} 

        access(all) fun createRaffle() {
            BagRaffle.totalRaffles = BagRaffle.totalRaffles + 1
            let newRaffle <- create Raffle()
            emit RaffleCreated(raffleId: newRaffle.id)
            self.raffles[newRaffle.id] <-! newRaffle
        }

        access(all) fun fundPrizePool(amount: @FlowToken.Vault) {
            let fundedAmount = amount.balance
            BagRaffle.prizePoolVault.deposit(from: <- amount)
            emit PrizePoolFunded(amount: fundedAmount)
        }

        access(all) fun resolveRaffle(raffleId: UInt64, owner:Address) {
            let totalPrize = BagRaffle.prizePoolVault.balance
            
            assert(totalPrize > 0.0, message: "Prize pool is empty")

            let raffleRef = self.getRaffle(raffleId: raffleId) 
                ?? panic("Raffle not found with ID: ".concat(raffleId.toString()))
            
            assert(!raffleRef.isResolved, message:"Raffle has already been resolved")

            let totalNfts = BagRaffle.getBagTotalSupply()
            let winningNftId = BagRaffle.generateRandomNumber(upperBound: totalNfts)
            
            raffleRef.setWinningNftId(newNftId: winningNftId)

            // Distribute prizes: 85% to winner, 15% to bag team
            let winnerPrizeAmount = totalPrize * 0.85
            let winnerPrize <- BagRaffle.prizePoolVault.withdraw(amount: winnerPrizeAmount) 
            // Deposit winner's prize into raffle prize vault
            raffleRef.prizeVault.deposit(from: <- winnerPrize)

            let bagTeamAmount = BagRaffle.prizePoolVault.balance
            let bagTeamPrize <- BagRaffle.prizePoolVault.withdraw(amount: bagTeamAmount)
            
            // Deposit owner share
            let bagTeamReceiver = getAccount(owner)
                .capabilities
                .borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver) 
                ?? panic("Could not borrow bag team receiver reference")
            
            bagTeamReceiver.deposit(from: <- bagTeamPrize)
            
            raffleRef.markAsResolved()

            emit RaffleResolved(raffleId: raffleId, winnerNftId: winningNftId)
        }

        access(all) fun getRaffle(raffleId: UInt64): &Raffle? {
            return &self.raffles[raffleId]
        }

        access(all) fun getAllRaffleIds(): [UInt64] {
            return self.raffles.keys
        }

        init() {
            self.raffles <- {}
        }
    }

    access(all) fun getRaffle(raffleId: UInt64): &Raffle {
        return self.getAdmin().getRaffle(raffleId: raffleId) 
            ?? panic("Raffle not found with ID: ".concat(raffleId.toString()))
    }

    access(contract) fun getAdmin(): &Admin {
        return self.account.storage.borrow<&Admin>(from: self.AdminStoragePath)
            ?? panic("Admin resource not found")
    }

    access(all) fun claimPrize(claimerAddress: Address, raffleId: UInt64) {
        let raffle = self.getRaffle(raffleId: raffleId)
        
        assert(raffle.isResolved, message: "Raffle has not been resolved yet")

        let userNftIds = TestBag.getCollectionSize(user: claimerAddress)
        let winningNftId = raffle.winningNftId
        
        // Check if claimant owns the winning NFT
        assert(userNftIds.contains(winningNftId), message: "Claimant does not own the winning NFT")
        // TestBag.get
        
        raffle.claimPrize(winnerAddress: claimerAddress)
    }
    
    access(self) fun generateRandomNumber(upperBound: UInt64): UInt64 {
        assert(upperBound > 0, message: "Upper bound must be greater than 0")
        let randomValue: UInt64 = revertibleRandom<UInt64>()
        return randomValue % upperBound
    }

    access(all) view fun getBagTotalSupply(): UInt64 {
        return TestBag.totalSupply
    }

    init() {
        self.totalRaffles = 0
        self.prizePoolVault <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>())
        self.AdminStoragePath = /storage/BagRaffleAdmin

        let admin: @Admin <- create Admin()
        self.account.storage.save(<- admin, to: self.AdminStoragePath)
    }
}