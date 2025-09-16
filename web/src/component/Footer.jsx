const Footer = () => {
  const handleExternalLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="mt-12 pt-8 text-center">
      <h3 className="font-bold mb-4">Still have questions?</h3>
      <p className="text-gray-600 mb-4">
        Join our community discussions or reach out directly.
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handleExternalLink('https://x.com/onchainbag')}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        >
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
  );
};

export default Footer;
