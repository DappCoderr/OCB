import * as fcl from '@onflow/fcl';

export const STAKE_TOKEN = `
import FlowStakingCollection from 0x8d0e87b65159ae63

/// Commits new tokens to stake for the specified node or delegator in the staking collection
/// The tokens from the locked vault are used first, if it exists
/// followed by the tokens from the unlocked vault

transaction(nodeID: String, delegatorID: UInt32?, amount: UFix64) {
    
    let stakingCollectionRef: auth(FlowStakingCollection.CollectionOwner) &FlowStakingCollection.StakingCollection

    prepare(account: auth(BorrowValue) &Account) {
        self.stakingCollectionRef = account.storage.borrow<auth(FlowStakingCollection.CollectionOwner) &FlowStakingCollection.StakingCollection>(from: FlowStakingCollection.StakingCollectionStoragePath)
            ?? panic("Could not borrow a reference to a StakingCollection in the primary user's account")
    }

    execute {
        self.stakingCollectionRef.stakeNewTokens(nodeID: nodeID, delegatorID: delegatorID, amount: amount)
    }
}
`;

export async function stakeTokens(nodeId, delegateId, amount) {
  try {
    const response = await fcl.mutate({
      cadence: STAKE_TOKEN,
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
