import * as fcl from '@onflow/fcl';

export const RESTAKE_REWARD = `

import FlowStakingCollection from 0xFlowStakingCollection

// Commits rewarded tokens to stake for the specified node or delegator in the staking collection

transaction(nodeID: String, delegatorID: UInt32?, amount: UFix64) {
    
    let stakingCollectionRef: auth(FlowStakingCollection.CollectionOwner) &FlowStakingCollection.StakingCollection

    prepare(account: auth(BorrowValue) &Account) {
        self.stakingCollectionRef = account.storage.borrow<auth(FlowStakingCollection.CollectionOwner) &FlowStakingCollection.StakingCollection>(from: FlowStakingCollection.StakingCollectionStoragePath)
            ?? panic("Could not borrow a reference to a StakingCollection in the primary user's account")
    }

    execute {
        self.stakingCollectionRef.stakeRewardedTokens(nodeID: nodeID, delegatorID: delegatorID, amount: amount)
    }
}
`;

export async function restakeReward(nodeId, delegateId, amount) {
  try {
    const response = await fcl.mutate({
      cadence: RESTAKE_REWARD,
      args: (arg, t) => [arg(nodeId, t.String)],
      args: (arg, t) => [arg(delegateId, t.UInt32)],
      args: (arg, t) => [arg(amount, t.UFix64)],
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
