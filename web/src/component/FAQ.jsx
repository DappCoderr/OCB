import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom for the home button

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is bag_?",
      answer:
        "The Bag is an adventure items inspired by the Loot Project. Each bag includes 8 items to build a distinctive avatar that tells its own stories, providing unique experiences and opening up possibilities for future gaming.",
    },
    {
      question: "Is the bag fully on-chain?",
      answer:
        "Yes, The Bag is a fully on-chain generative and randomised NFT, thanks to Flow VRF.",
    },
    {
      question: "How do we purchase the bag, and what is its price?",
      answer:
        "To purchase Bag, you need Flow Tokens, and each bag costs 60 Flow.",
    },
    {
      question: "How is bag rarity defined?",
      answer:
        "Each bag has a rarity score generated on-chain, determining its value and uniqueness.",
    },
    {
      question: "How many bags can one user mint?",
      answer: "Each wallet address can hold a maximum of 20 bags.",
    },
    {
      question: "Total Supply of Bag NFT?",
      answer: "There will be a total of 8888 NFT.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto mt-8 bg-black text-white p-4 rounded-lg">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              className="flex justify-between items-center w-full py-3 px-4 text-left focus:outline-none"
              onClick={() => toggleAccordion(index)}
            >
              <span className="font-bold">{faq.question}</span>
              <svg
                className={`h-5 w-5 transition-transform duration-300 transform ${
                  openIndex === index ? "rotate-90" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {openIndex === index && <p className="py-3 px-4">{faq.answer}</p>}
          </div>
        ))}
      </div>
      <div>
        <Link
          to="/"
          className="text-black font-bold mb-4 block text-center mt-20"
        >
          🔙 Home
        </Link>{" "}
        {/* Home button */}
      </div>
    </>
  );
};

export default FAQ;
