import { useState } from 'react';
import { faqs } from '../../utils/constants';

const FAQSection = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about OCB and how it works.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                className="flex justify-between items-center w-full p-6 text-left font-semibold text-gray-900 hover:text-emerald-600 focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${activeFAQ === index ? 'transform rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {activeFAQ === index && (
                <div className="px-6 pb-6 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Still have questions? We're here to help!
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

        {/* <div className="mt-12 pt-8 border-t border-gray-200 text-center">
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
      </div> */}
      </div>
    </section>
  );
};

export default FAQSection;
