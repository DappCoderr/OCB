import * as fcl from '@onflow/fcl';

export const RESOLVE_LOTTERY = `
import FlowToken from 0xFlowToken
import FungibleToken from 0xFungibleToken

import BagLottery from 0xBagLottery

/// Transaction: FundPrizePoolCreateAndResolveLottery
/// Description: Funds the prize pool, creates a new lottery, and immediately resolves it
transaction(amount: UFix64, owner: Address) {

    let prizeContributionVault: @{FungibleToken.Vault}
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
        assert(signerVaultRef.balance >= amount, message: "Insufficient FLOW balance. ".concat("Required: ").concat(amount.toString()).concat(", Available: ").concat(signerVaultRef.balance.toString()))

        // Borrow reference to the BagLottery Admin resource
        self.adminReference = signer.storage.borrow<&BagLottery.Admin>(from: BagLottery.AdminStoragePath) ?? panic(
            "Admin resource not found. "
            .concat("Path: ").concat(BagLottery.AdminStoragePath.toString())
            .concat(". Signer must have Admin privileges.")
        )

        // Withdraw the specified amount from signer's vault
        self.prizeContributionVault <- signerVaultRef.withdraw(amount: amount)
    }

    execute {
        // Step 1: Fund the prize pool with the contributed amount
        self.adminReference.fundPrizePool(amount: <- self.prizeContributionVault)
        
        // Verify the prize pool was successfully funded
        let prizePoolBalance = BagLottery.getLotteryVaultBalance()
        assert(
            prizePoolBalance > 0.0,
            message: "Prize pool funding failed. ".concat("Expected: > 0.0, Actual: ").concat(prizePoolBalance.toString())
        )

        // Step 2: Create a new lottery
        self.adminReference.createLottery()
        
        // Retrieve and validate the new lottery ID
        self.newLotteryId = BagLottery.totalLottery
        assert(
            BagLottery.totalLottery == self.newLotteryId,
            message: "Lottery creation failed. "
                    .concat("Expected ID: ").concat(self.newLotteryId.toString())
                    .concat(", Actual total: ").concat(BagLottery.totalLottery.toString())
        )

        // Step 3: Resolve the newly created lottery
        self.adminReference.resolveLottery(lotteryID: self.newLotteryId, owner: owner)
    }

    post {
        // Verify the lottery was created with the expected ID
        BagLottery.totalLottery == self.newLotteryId:
            "Lottery creation verification failed. Total lotteries should be ".concat((self.newLotteryId).toString())
    }
}
`                                                                     

export async function resolveLottery(amount, owner) {
  try {
    const response = await fcl.mutate({
      cadence: RESOLVE_LOTTERY,
      args: (arg, t) => [arg(amount, t.UFix64)],
      args: (arg, t) => [arg(owner, t.Address)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });
    const res = await fcl.tx(response).onceSealed();
    return res;
  } catch (error) {
    const msg =
      (typeof error === 'string' && error) ||
      (error && error.message) ||
      (error && error.errorMessage) ||
      'Transaction failed';
    if (msg.toLowerCase().includes('declined')) {
      throw new Error('User denied transaction');
    }
    throw new Error(msg);
  }
}