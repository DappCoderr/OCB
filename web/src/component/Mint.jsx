import { useState } from "react";

function Mint({ walletConnected, totalMinted, setTotalMinted }) {
  const [mintCount, setMintCount] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastMintedCount, setLastMintedCount] = useState(0);
  const maxSupply = 6666;

  const handleMint = () => {
    if (walletConnected) {
      setTotalMinted((prev) => prev + mintCount);
      setLastMintedCount(mintCount);
      setShowSuccess(true);
      // Hide success message after 10 seconds
      setTimeout(() => setShowSuccess(false), 10000);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <p className="text-gray-600 mb-6">
          Join the community-owned NFT collection.
          <br />
          Each piece represents true digital ownership.
        </p>
      </div>

      {/* Minting Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Minted:</span>
          <span className="font-bold">
            {totalMinted.toLocaleString()} / {maxSupply.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(totalMinted / maxSupply) * 100}%` }}
          ></div>
        </div>
        <div className="text-center text-sm text-gray-500">
          {((totalMinted / maxSupply) * 100).toFixed(1)}% minted
        </div>
      </div>

      {/* Minting Interface */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <label className="font-bold">Quantity:</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMintCount(Math.max(1, mintCount - 1))}
              className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              -
            </button>
            <span className="w-12 text-center font-bold">{mintCount}</span>
            <button
              onClick={() => setMintCount(Math.min(10, mintCount + 1))}
              className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="font-bold">Price:</span>
          <span className="font-bold">120.0 FLOW each</span>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total:</span>
            <span>{(120.0 * mintCount).toFixed(2)} FLOW</span>
          </div>
        </div>

        <button
          onClick={handleMint}
          disabled={!walletConnected}
          className={`w-full py-3 rounded font-bold transition-colors ${
            walletConnected
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {walletConnected
            ? `Mint ${mintCount} NFT${mintCount > 1 ? "s" : ""}`
            : "Connect Wallet to Mint"}
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-bold text-green-800">
              Successfully minted {lastMintedCount} NFT
              {lastMintedCount > 1 ? "s" : ""}!
            </h3>
          </div>
          <p className="text-green-700 mb-4">
            Your NFT{lastMintedCount > 1 ? "s have" : " has"} been minted
            successfully. You can view {lastMintedCount > 1 ? "them" : "it"} on
            OpenSea once the metadata is processed.
          </p>
          <a
            href="https://opensea.io/account"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16l-5.152 8.416a.756.756 0 01-1.296 0L5.968 8.16a.756.756 0 01.648-1.152h10.304a.756.756 0 01.648 1.152z" />
            </svg>
            View on OpenSea
          </a>
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold mb-3">Minting Details:</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Maximum 10 NFTs per transaction</li>
          <li>• Metadata revealed immediately after mint</li>
          <li>• Zero-gas fees</li>
        </ul>
      </div>
    </main>
  );
}

export default Mint;
