import { Twitter, Mail, FileText } from 'lucide-react';

const Footer = () => {
  const handleExternalLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="mt-16 pt-8 pb-6 text-center border-t border-gray-200/30">
      <h3 className="font-bold text-lg mb-3 text-gray-800">
        Still have questions?
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Join our community discussions or reach out directly. We're here to
        help!
      </p>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handleExternalLink('https://x.com/onchainbag')}
          className="p-3 bg-gray-800 text-white rounded-full hover:bg-blue-50 hover:text-blue-500 transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md group"
          aria-label="Twitter"
        >
          <Twitter
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
        </button>

        <button
          onClick={() =>
            (window.location.href = 'mailto:support@onchainbag.xyz')
          }
          className="p-3 bg-gray-800 text-white rounded-full hover:bg-indigo-50 hover:text-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md group"
          aria-label="Email Support"
        >
          <Mail
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
        </button>

        <button
          onClick={() =>
            handleExternalLink(
              'https://contractbrowser.com/A.11106fe6700496e8.Bag'
            )
          }
          className="p-3 bg-gray-800 text-white rounded-full hover:bg-purple-50 hover:text-purple-500 transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md group"
          aria-label="Smart Contract"
        >
          <FileText
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
        </button>
      </div>

      <p className="text-gray-500 text-sm mt-6">
        © {new Date().getFullYear()} OnChain Bag. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
