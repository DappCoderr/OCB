export const BAG_CONTRACT_ADDRESS = 0x337e140cac71c1f0;
export const LOTTERY_CONTRACT_ADDRESS = 0x337e140cac71c1f0;
export const FUNGBLE_CONTRACT_ADDRESS = 0x9a0766d93b6608b7;
export const FLOW_TOKEN = 0x7e60df042a9c0868;
export const ADMIN_ADDRESS = '0x6d9e6334ddad7844';

export const NODE_ID =
  '4afbd63916c3cec5bb75a34d607bcec3c670de952ed1556fa103c680b59b6215';
export const NODE_TYPE = 'Consensus';

export const TRANSACTION_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  FINALIZED: 'finalized',
  EXECUTED: 'executed',
  SEALED: 'sealed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  DECLINED: 'declined',
};

export const statusMessages = {
  [TRANSACTION_STATUS.IDLE]: 'Preparing transaction...',
  [TRANSACTION_STATUS.PENDING]: 'Transaction submitted to blockchain...',
  [TRANSACTION_STATUS.FINALIZED]:
    'Transaction finalized, waiting for execution...',
  [TRANSACTION_STATUS.EXECUTED]: 'Transaction executed, confirming results...',
  [TRANSACTION_STATUS.SEALED]: 'Transaction sealed and confirmed!',
  [TRANSACTION_STATUS.FAILED]: 'Transaction failed',
  [TRANSACTION_STATUS.CANCELLED]: 'Transaction cancelled',
  [TRANSACTION_STATUS.DECLINED]: 'Transaction declined',
};

export const faqs = [
  {
    question: 'What is OCB?',
    answer:
      'Bag (OCB) is a yield-bearing, fully on-chain GameFi NFT powered by Flow VRF. Unlike typical NFT art, Bag is a financial NFT — its mint price is staked to generate real yield, which flows back to holders. Identity, utility, and rewards — all packed into a single Bag.',
  },
  {
    question: 'How much does it cost to mint a Bag?',
    answer:
      'Each Bag starts at 60 FLOW to mint. The price follows a stepwise linear bonding curve, increasing by 10 FLOW after every 555 NFTs are minted.',
  },
  {
    question: 'How does the staking amount grow over time?',
    answer:
      '15% of all staking rewards are automatically restaked (compounded). This grows the total stake, so future weekly rewards increase continuously.',
  },
  {
    question: 'What makes this project different?',
    answer:
      'Unlike typical NFT projects with zero utility, Bag (OCB) combines real yield generation with playable GameFi mechanics, powered by provably fair, fully on-chain systems — offering identity, rewards, and gameplay in a single NFT.',
  },
  {
    question: 'Are there royalties on secondary sales?',
    answer:
      'Yes, a 5% royalty fee from all secondary marketplace sales goes to the Bag team, helping sustain the project and grow the community.',
  },
  {
    question: 'What blockchain is this on?',
    answer:
      'Bag is built on the Flow mainnet, ensuring scalability, composability, and decentralization.',
  },
  {
    question: 'How does staking work?',
    answer:
      'When you mint a Bag, your mint price is staked into Flow nodes, generating 8% APY. Weekly rewards are distributed through a provably fair lottery.',
  },
  {
    question: 'How do Bag Lottery rewards work?',
    answer:
      'Each week, staking rewards are pooled and distributed to one Bag holders through a provably fair lottery powered by Flow VRF. This gives every holder a chance to win while ensuring total randomness and transparency.',
  },
  {
    question: 'What happens if I sell my Bag?',
    answer:
      'When you sell your Bag on the marketplace, the new owner inherits its staking rewards and win count. The NFT carries its full financial and gameplay history.',
  },
  {
    question: 'Can I redeem my Bag for a playable avatar?',
    answer:
      'Yes! In future phases, you can redeem your Bag into a playable avatar with 7 unique traits. These traits will also be tradable individually.',
  },
  {
    question: 'How many Bags are there?',
    answer:
      'There are a total of 7,777 Bags. Each Bag is 100% unique and fully on-chain, generated via Flow VRF to ensure no duplicates.',
  },
  {
    question: 'How do you ensure fairness and security?',
    answer:
      'All randomness comes from Flow VRF, and for staking, we use the Flow core smart contract to stake tokens into the Flow node, ensuring provable fairness with full composability. Smart contracts are fully on-chain, transparent, and audited for safety.',
  },
  {
    question: 'How will gameplay work?',
    answer:
      'Bag holders can compete in future games using their avatars. By playing, you can earn XP, climb leaderboards, and win additional rewards.',
  },
];
