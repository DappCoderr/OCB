import { useState } from "react";

function FAQ() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "What is OCB 0.1?",
      answer:
        "OCB stands for On-Chain Bag, and 0.1 represents it's version. It's for who believe in Flow, NFTs, Rewards, and Community Owned Artworks — Just pure, on-chain identity built by and for the people.",
    },
    {
      question: "How much does it cost to mint?",
      answer:
        "Each NFT costs 120.0 FLOW to mint. You can mint up to 10 NFTs per transaction.",
    },
    {
      question: "What makes this project different?",
      answer:
        "We prioritize true decentralization and community ownership. There are no platform restrictions, marketplace lock-ins. The art and ownership belong entirely to the community.",
    },
    {
      question: "Are there royalties?",
      answer:
        "Yes. A portion of secondary sales goes to the platform — and that share is also staked into the network to generate additional yield for the community.",
    },
    {
      question: "Can I transfer my NFTs?",
      answer:
        "Absolutely. Your NFTs are fully transferable with no restrictions. You can sell, trade, or gift them on any marketplace.",
    },
    {
      question: "What blockchain is this on?",
      answer:
        "OCB 0.1 is built on Flow mainnet, ensuring maximum compatibility and decentralization.",
    },
    {
      question: "What happens after mint?",
      answer:
        "Your NFT metadata is revealed immediately after minting. You'll own a unique piece of digital art that's permanently stored on the blockchain.",
    },
    {
      question: "Is there a roadmap?",
      answer:
        "We intentionally avoid traditional roadmaps with unrealistic promises. Our focus is on building a sustainable, community-driven collection that stands the test of time through genuine artistic value.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleExternalLink = (url) => {
    window.open(url, "_blank");
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600 mb-6">
          Everything you need to know about CryptoArt R1.
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
                  openFAQ === index ? "rotate-180" : ""
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
            Telegram
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
            Email
          </button>
          <button
            onClick={() =>
              handleExternalLink(
                "https://contractbrowser.com/A.36e0dc989fe11d54.Bag"
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
