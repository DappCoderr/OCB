// import FlowStakingCollection from 0x95e019a17d0e23d7
import FungibleToken from "../../contracts/interface/FungibleToken.cdc"
import FlowToken from "../../contracts/interface/FlowToken.cdc"
import BagLottery from "../../contracts/BagLottery.cdc"
import BagDistributionRatio from "../../contracts/BagDistributionRatio.cdc"

/// Request to withdraw rewarded tokens for the specified node or delegator in the staking collection
/// The tokens are automatically deposited to the unlocked account vault first,
/// And then any locked tokens are deposited into the locked account vault

transaction(nodeID: String, delegatorID: UInt64?, amount: UFix64, bagTeam: Address) {
    
    let stakingCollectionRef: auth(FlowStakingCollection.CollectionOwner) &FlowStakingCollection.StakingCollection

    let adminBagLotteryRef: &BagLottery.Admin
    // let vaultRef: @{FungibleToken.Vault}

    let signerVaultRef: auth(FungibleToken.Withdraw) &FlowToken.Vault

    prepare(account: auth(BorrowValue) &Account) {
        self.stakingCollectionRef = account.storage.borrow<auth(FlowStakingCollection.CollectionOwner) &FlowStakingCollection.StakingCollection>(from: FlowStakingCollection.StakingCollectionStoragePath)
            ?? panic(FlowStakingCollection.getCollectionMissingError(nil))

        
        self.signerVaultRef = account.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic(
            "Signer account missing FlowToken vault. " 
            .concat("Path: /storage/flowTokenVault. ")
            .concat("Please initialize account with FlowToken vault first.")
        )

        self.adminBagLotteryRef = account.storage.borrow<&BagLottery.Admin>(from: BagLottery.AdminStoragePath) ?? panic(
            "Admin resource not found. "
            .concat("Path: ").concat(BagLottery.AdminStoragePath.toString())
            .concat(". Signer must have Admin privileges.")
        )
    }

    execute {

        // Step 1: Claim Tokens
        self.stakingCollectionRef.stakeNewTokens(nodeID: nodeID, delegatorID: delegatorID, amount: amount)

        // Step 2: Calculate the target 8% distribution amount
        let targetAmount = BagDistributionRatio.calculateWeeklyDistribution(nodeID: nodeID, delegatorID: delegatorID)

        // Step 3: Ensure we don't distribute more than we actually claimed
        let bagRatio = amount - targetAmount

        // Step 4: Withdraw and distribute to lottery
        let weeklyReward <- self.signerVaultRef.withdraw(amount: targetAmount)
        self.adminBagLotteryRef.fundPrizePool(amount: <- weeklyReward)

        // Step 5: Withdraw and send team share
        let bagFee <- self.signerVaultRef.withdraw(amount: bagRatio)

        let receiverRef =  getAccount(bagTeam)
            .capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            ?? panic("Could not borrow a Receiver reference to the FlowToken Vault in account")

        // Deposit the bagFee tokens in the bagTeam's receiver address
        receiverRef.deposit(from: <- bagFee)
        
    }

}