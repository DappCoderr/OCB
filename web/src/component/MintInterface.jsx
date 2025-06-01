import PropTypes from "prop-types";

const MintInterface = ({
  setMintCount,
  mintCount,
  minting,
  bagPrice,
  handleMint,
  isWalletConnected,
  minMint = 1,
  maxMint = 10,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <label className="font-semibold text-sm">Quantity:</label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMintCount(Math.max(minMint, mintCount - 1))}
            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors font-bold text-base"
            disabled={minting}
          >
            -
          </button>
          <span className="w-10 text-center font-bold text-base">
            {mintCount}
          </span>
          <button
            onClick={() => setMintCount(Math.min(maxMint, mintCount + 1))}
            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors font-bold text-base"
            disabled={minting}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-sm">Price:</span>
        <span className="font-semibold text-sm">{bagPrice} FLOW each</span>
      </div>
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex items-center justify-between text-base font-bold">
          <span>Total:</span>
          <span>{(bagPrice * mintCount).toFixed(2)} FLOW</span>
        </div>
      </div>
      <button
        onClick={handleMint}
        disabled={!isWalletConnected || minting}
        className={`w-full py-3 rounded font-bold transition-colors text-base ${
          isWalletConnected && !minting
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {minting
          ? "Minting..."
          : isWalletConnected
          ? `Mint ${mintCount} NFT${mintCount > 1 ? "s" : ""}`
          : "Connect Wallet to Mint"}
      </button>
    </div>
  );
};

MintInterface.propTypes = {
  setMintCount: PropTypes.func.isRequired,
  mintCount: PropTypes.number.isRequired,
  minting: PropTypes.bool.isRequired,
  bagPrice: PropTypes.number.isRequired,
  handleMint: PropTypes.func.isRequired,
  isWalletConnected: PropTypes.bool.isRequired,
  minMint: PropTypes.number,
  maxMint: PropTypes.number,
};

MintInterface.defaultProps = {
  minMint: 1,
  maxMint: 10,
};

export default MintInterface;
