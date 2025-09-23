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
      "Bag (OCB) is a fully on-chain GameFi asset, powered by Flow VRF randomness to ensure complete fairness. Each Bag contains 7 unique traits, forming a one-of-a-kind warrior identity. Bag is not just about art — every mint amount is staked into Flow nodes, generating real yield that flows back to holders. It's identity, utility, and rewards, all packed into a single Bag.",
  },
  {
    question: 'How much does it cost to mint a Bag?',
    answer:
      'Each Bag costs 60.0 FLOW to mint. After every 555 NFTs minted, the mint price will increase by 10.0 FLOW.',
  },
  {
    question: 'How does the staking amount grow over time?',
    answer:
      'Each week, 15% of the staking reward is automatically restaked (compounded). This increases the total stake, allowing the future weekly rewards to grow continuously.',
  },
  {
    question: 'What makes this project different?',
    answer:
      'Unlike typical NFTs with zero utility. Bag gives you weekly reward. Redeem an avatar from your Bag to play in the upcoming game. Future Bag token airdrops may reward holders. Bag isn’t just art — it’s identity, utility, and rewards all in one.',
  },
  {
    question: 'Are there royalties on secondary sales?',
    answer:
      'Yes, a 5% royalty fee from all secondary marketplace sales goes to the Bag team, helping sustain the project and community.',
  },
  // {
  //   question: 'How does the Bag team earn',
  //   answer:
  //     'The Bag team has three revenue streams: 5% fee from weekly rewards, 5% royalty cut from secondary sales, 100 Bags reserved for the team, which also receive rewards. These funds are reinvested into development, marketing, and project growth.',
  // },
  {
    question: 'What blockchain is this on?',
    answer:
      'Bag is built on Flow mainnet, ensuring maximum compatibility and decentralization.',
  },
  {
    question: 'How does staking work?',
    answer:
      'When a user mints a Bag, the mint amount is staked into Flow validator node. The staking generates weekly rewards, which are then distributed to one lucky holder through a Bag Lottery smart contract. This creates a game of chance where every Bag you hold gives you a shot at winning the weekly reward',
  },
  {
    question: 'Is there a roadmap?',
    answer:
      'We intentionally avoid traditional roadmaps with unrealistic promises. Our focus is on building a sustainable collection that stands the test of time.',
  },
];
