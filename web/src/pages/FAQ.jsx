import { useState } from 'react';
import { faqs } from '../utils/constants';

function FAQ() {
  const [openFAQ, setOpenFAQ] = useState(null);
  
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

      <div className="mt-12 pt-8 text-center">
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
                'https://contractbrowser.com/A.11106fe6700496e8.Bag'
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
