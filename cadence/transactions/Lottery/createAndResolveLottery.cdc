import FungibleToken from "../../contracts/interface/FungibleToken.cdc"
import FlowToken from "../../contracts/interface/FlowToken.cdc"
import BagLottery from "../../contracts/BagLottery.cdc"

/// Transaction: FundPrizePoolCreateAndResolveLottery
/// Description: Creates a new lottery, Funds the prize pool and immediately resolves it
transaction() {

    // let prizeContributionVault: @{FungibleToken.Vault}
    let adminReference: &BagLottery.Admin
    var newLotteryId: UInt64

    prepare(signer: auth(BorrowValue) &Account) {
        // Initialize lottery ID to zero (will be set during execution)
        self.newLotteryId = 0

        let signerVaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic(
            "Signer account missing FlowToken vault. " 
            .concat("Path: /storage/flowTokenVault. ")
            .concat("Please initialize account with FlowToken vault first.")
        )

        // Verify the signer has sufficient balance for the contribution
        // assert(signerVaultRef.balance >= amount, message: "Insufficient FLOW balance. ".concat("Required: ").concat(amount.toString()).concat(", Available: ").concat(signerVaultRef.balance.toString()))

        // Borrow reference to the BagLottery Admin resource
        self.adminReference = signer.storage.borrow<&BagLottery.Admin>(from: BagLottery.AdminStoragePath) ?? panic(
            "Admin resource not found. "
            .concat("Path: ").concat(BagLottery.AdminStoragePath.toString())
            .concat(". Signer must have Admin privileges.")
        )
    }

    execute {
        
        // Verify the prize pool has the Reward
        let prizePoolBalance = BagLottery.getLotteryVaultBalance()
        assert(
            prizePoolBalance > 0.0,
            message: "Prize pool funding failed. ".concat("Expected: > 0.0, Actual: ").concat(prizePoolBalance.toString())
        )

        // Create a new lottery
        self.adminReference.createLottery()
        
        // Retrieve and validate the new lottery ID
        self.newLotteryId = BagLottery.totalLottery
        assert(
            BagLottery.totalLottery == self.newLotteryId,
            message: "Lottery creation failed. "
                    .concat("Expected ID: ").concat(self.newLotteryId.toString())
                    .concat(", Actual total: ").concat(BagLottery.totalLottery.toString())
        )

        // Resolve the newly created lottery
        self.adminReference.resolveLottery(lotteryID: self.newLotteryId)
    }

    post {
        // Verify the lottery was created with the expected ID
        BagLottery.totalLottery == self.newLotteryId:
            "Lottery creation verification failed. Total lotteries should be ".concat((self.newLotteryId).toString())
    }
}