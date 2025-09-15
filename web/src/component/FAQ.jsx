import { useState } from 'react';

function FAQ() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: 'What is OCB?',
      answer:
        "Bag (OCB) is a fully on-chain GameFi asset, powered by Flow VRF randomness to ensure complete fairness. Each Bag contains 7 unique traits, forming a one-of-a-kind warrior identity. Bag is not just about art — every mint amount is staked into Flow nodes, generating real yield that flows back to holders. It's identity, utility, and rewards, all packed into a single Bag.",
    },
    {
      question: 'How much does it cost to mint a Bag?',
      answer:
        'Each Bag costs 60.0 FLOW to mint. After every 1,111 NFTs minted, the mint price will increase by 10.0 FLOW.',
    },
    {
      question: 'What makes this project different?',
      answer:
        "Unlike typical NFTs with zero utility. Bag gives you weekly reward. Redeem an avatar from your Bag to play in the upcoming game. Future Bag token airdrops may reward holders. Bag isn’t just art — it’s identity, utility, and rewards in one.",
    },
    {
      question: 'Are there royalties on secondary sales?',
      answer:
        'Yes, a 5% royalty fee from all secondary marketplace sales goes to the Bag team, helping sustain the project and community.',
    },
    {
      question: 'How does the Bag team earn',
      answer:
        'The Bag team has three revenue streams: 5% fee from weekly rewards, 5% royalty cut from secondary sales, 100 Bags reserved for the team, which also receive rewards. These funds are reinvested into development, marketing, and project growth.',
    },
    {
      question: 'What blockchain is this on?',
      answer:
        'Bag is built on Flow mainnet, ensuring maximum compatibility and decentralization.',
    },
    {
      question: 'How does staking work?',
      answer:
      "When a user mints a Bag, the mint amount is staked into Flow validator node. The staking generates weekly rewards, which are then distributed to one lucky holder through a Bag Lottery smart contract. This creates a game of chance where every Bag you hold gives you a shot at winning the weekly reward"
    },
    {
      question: 'How does the staking amount grow over time?',
      answer:
      "Each week, 15% of the staking reward is automatically restaked (compounded). This increases the total stake, allowing the future weekly rewards to grow continuously."
    },
    {
      question: 'Is there a roadmap?',
      answer:
        'We intentionally avoid traditional roadmaps with unrealistic promises. Our focus is on building a sustainable collection that stands the test of time.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleExternalLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600 mb-6">
          Everything you need to know about On-Chain-Bag.
          <br />
          Still have questions? Join our community discussions.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left font-bold hover:bg-gray-50 transition-colors flex justify-between items-center"
            >
              <span>{faq.question}</span>
              <span
                className={`transform transition-transform ${
                  openFAQ === index ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>
            {openFAQ === index && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <h3 className="font-bold mb-4">Still have questions?</h3>
        <p className="text-gray-600 mb-4">
          Join our community discussions or reach out directly.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
            X
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
            Email
          </button>
          <button
            onClick={() =>
              handleExternalLink(
                'https://contractbrowser.com/A.36e0dc989fe11d54.Bag'
              )
            }
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            aria-label="View smart contract"
          >
            contract
          </button>
        </div>
      </div>
    </main>
  );
}

export default FAQ;
