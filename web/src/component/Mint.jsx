import { useState, useEffect } from "react";
import { useCurrentFlowUser } from "@onflow/kit";
import { getMaxSupply } from "../flow/Script/getMaxSupply.script";
import { getBagPrice } from "../flow/Script/getBagPrice.script";
import { getTotalSupply } from "../flow/Script/getTotalSupply.script";
import { mintNFT } from "../flow/Transaction/Mint.tx";
import toast from "react-hot-toast";
import { parseFlowError } from "../utils/parseFlowError";

function Mint() {
  const { user } = useCurrentFlowUser();
  const [mintCount, setMintCount] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastMintedCount, setLastMintedCount] = useState(0);
  const [maxSupply, setMaxSupply] = useState(null);
  const [bagPrice, setBagPrice] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minting, setMinting] = useState(false);

  // Fetch on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [max, price, supply] = await Promise.all([
          getMaxSupply(),
          getBagPrice(),
          getTotalSupply(),
        ]);
        setMaxSupply(Number(max));
        setBagPrice(Number(price));
        setTotalSupply(Number(supply));
      } catch (e) {
        setError("Failed to fetch contract data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleMint = async () => {
    if (!user) return;
    setMinting(true);
    setError(null);
    try {
      const amount = (bagPrice * mintCount).toFixed(2);
      await mintNFT(amount);
      setLastMintedCount(mintCount);
      setShowSuccess(true);
      // Refetch total supply after mint
      const updatedSupply = await getTotalSupply();
      setTotalSupply(Number(updatedSupply));
      setTimeout(() => setShowSuccess(false), 10000);
    } catch (e) {
      const message = parseFlowError(e);
      setError(message);
      toast.error(message);
      setTimeout(() => setError(null), 8000);
    } finally {
      setMinting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading minting data...</div>;
  }
  if (error) {
    return (
      <div className="mb-6 p-4 rounded bg-red-100 border border-red-300 text-red-800 text-center font-semibold animate-pulse">
        {error}
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <p className="text-gray-600 mb-6">
          Join the community-owned NFT collection.
          <br />
          Each piece represents true digital ownership.
        </p>
      </div>

      {/* Error Message (for transaction and fetch errors) */}
      {error && (
        <div className="mb-6 p-4 rounded bg-red-100 border border-red-300 text-red-800 text-center font-semibold animate-pulse">
          {error}
        </div>
      )}

      {/* Minting Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Minted:</span>
          <span className="font-bold">
            {totalSupply?.toLocaleString()} / {maxSupply?.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${((totalSupply || 0) / (maxSupply || 1)) * 100}%`,
            }}
          ></div>
        </div>
        <div className="text-center text-sm text-gray-500">
          {(((totalSupply || 0) / (maxSupply || 1)) * 100).toFixed(1)}% minted
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
              disabled={minting}
            >
              -
            </button>
            <span className="w-12 text-center font-bold">{mintCount}</span>
            <button
              onClick={() => setMintCount(Math.min(10, mintCount + 1))}
              className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              disabled={minting}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="font-bold">Price:</span>
          <span className="font-bold">{bagPrice} FLOW each</span>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total:</span>
            <span>{(bagPrice * mintCount).toFixed(2)} FLOW</span>
          </div>
        </div>

        <button
          onClick={handleMint}
          disabled={!user || minting}
          className={`w-full py-3 rounded font-bold transition-colors ${
            user && !minting
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {minting
            ? "Minting..."
            : user
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
