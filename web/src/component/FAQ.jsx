import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom for the home button

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is bag?",
      answer:
        "Bag is a collection of digital gear, inspired by the Loot Project.  Each Bag contains 8 unique pieces, like a randomized treasure chest for your avatar. Build a one-of-a-kind character that speaks volumes about your adventures. It's more than just looks - Bag opens the door to future games, letting you bring your customized avatar to life.",
    },
    {
      question: "Is the bag fully on-chain?",
      answer:
        "Absolutely! Bag is a fully on-chain experience. From the generation and randomization (thanks to Flow VRF) of your gear to the items themselves, everything is stored securely on the blockchain",
    },
    {
      question: "How is bag rarity defined?",
      answer:
        "Bag rarity combines individual item scores on-chain to define the uniqueness of your entire adventurer's gear collection.",
    },
    {
      question: "How many bags can one user mint?",
      answer: "Each wallet address can hold a maximum of 20 bags.",
    },
    {
      question: "Total Supply of Bag NFT?",
      answer: "There will be a total of 6666 NFT.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className=" w-screen min-h-screen bg-black text-white p-4 sm:w-full sm:max-w-xl sm:text-black sm:bg-white sm:mx-auto sm:pt-8">
        <h1 className="text-center mb-4 font-bold">FAQ</h1>
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
        <Link
          to="/"
          className="text-white font-bold mt-14 block text-center sm:text-black"
        >
          🔙 Home
        </Link>{" "}
      </div>
    </>
  );
};

export default FAQ;
