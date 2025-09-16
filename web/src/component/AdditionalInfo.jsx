const AdditionalInfo = () => {
  return (
    <div className="bg-[#1A1D28] border border-[#2A2D3A] rounded-2xl p-6 mt-6 shadow-lg">
      <h3 className="font-semibold text-white mb-4 text-lg flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        Collection Details
      </h3>
      <ul className="text-gray-300 space-y-3">
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <span>Fully on-chain GameFi collectible</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <span>Weekly reward distribution to holders</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <span>Max 20 Bags per account</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <span>Zero gas fees for transactions</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <span>Game & Avatar coming soon...</span>
        </li>
      </ul>
    </div>
  );
};

export default AdditionalInfo;
