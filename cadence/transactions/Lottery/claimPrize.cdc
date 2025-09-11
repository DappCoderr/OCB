import FungibleToken from "../../contracts/interface/FungibleToken.cdc"
import FlowToken from "../../contracts/interface/FlowToken.cdc"
import BagLottery from "../../contracts/BagLottery.cdc"


/// Transaction: ClaimPrize
/// Description: Allows a user to claim their prize from a resolved lottery
transaction(lotteryID: UInt64) {

    /// The address of the user claiming the prize
    let claimerAddress: Address

    prepare(signer: auth(BorrowValue) &Account) {
        // Store the signer's address for prize distribution
        self.claimerAddress = signer.address
    }

    execute {
        BagLottery.claimPrize(claimerAddress: self.claimerAddress, lotteryID: lotteryID)
    }
}