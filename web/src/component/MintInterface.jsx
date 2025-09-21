import PropTypes from 'prop-types';
import { useState } from 'react';
import { FlowIcon } from './FlowIcon';

const MintInterface = ({
  bagPrice = 0,
  isWalletConnected = false,
  userBalance = 0,
  userNFTCount = 0,
  hasCollection = false,
  maxNFTsReached = false,
  onMint,
  minting = false,
}) => {
  const [mintCount, setMintCount] = useState(1);
  const minMint = 1;
  const maxMint = 10;

  const totalCost = bagPrice * mintCount;
  const hasSufficientBalance = userBalance >= totalCost;

  // Determine if user can mint based on multiple conditions
  const canMint =
    hasSufficientBalance &&
    isWalletConnected &&
    !minting &&
    (!hasCollection || !maxNFTsReached);

  const getButtonText = () => {
    if (minting) return 'Minting...';
    if (!isWalletConnected) return 'Connect Wallet to Mint';
    if (maxNFTsReached) return 'Max NFTs Reached (20/20)';
    if (!hasSufficientBalance) return 'Insufficient Balance';
    return `Mint ${mintCount} NFT${mintCount > 1 ? 's' : ''}`;
  };

  const handleMint = () => {
    if (canMint) {
      onMint(mintCount);
    }
  };

  const handleIncrement = () => {
    setMintCount((prev) => Math.min(maxMint, prev + 1));
  };

  const handleDecrement = () => {
    setMintCount((prev) => Math.max(minMint, prev - 1));
  };

  return (
    <div className="bg-[#1A1D28] rounded-2xl p-6 border border-[#2A2D3A] shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <label className="font-semibold text-gray-300">Quantity:</label>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDecrement}
            disabled={minting || maxNFTsReached || mintCount <= minMint}
            className="w-9 h-9 border border-white bg-white rounded-lg hover:bg-gray-300 transition-colors font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="w-12 text-center font-bold text-white text-lg">
            {mintCount}
          </span>
          <button
            onClick={handleIncrement}
            disabled={minting || maxNFTsReached || mintCount >= maxMint}
            className="w-9 h-9 border border-white bg-white rounded-lg hover:bg-gray-300 transition-colors font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <span className="font-semibold text-gray-300">Price:</span>
        <span className="font-semibold text-white">
          {Math.round(bagPrice)} FLOW each
        </span>
      </div>

      <div className="border-t border-[#2A2D3A] pt-4 mb-6">
        <div className="flex items-center justify-between text-lg font-bold">
          <span className="text-gray-300">Total:</span>
          <span className="text-white flex gap-2">
            {bagPrice * mintCount}.0 <FlowIcon height={28} />{' '}
          </span>
        </div>

        {isWalletConnected && (
          <>
            <div className="mt-2 text-sm text-gray-400">
              Your balance: {Math.floor(userBalance).toLocaleString()} FLOW
              {!hasSufficientBalance && (
                <span className="text-red-400 ml-2">
                  (Insufficient balance)
                </span>
              )}
            </div>

            {/* Only show NFT count if user has a collection */}
            {hasCollection && (
              <div className="mt-1 text-sm text-gray-400">
                Your NFTs: {userNFTCount}/20
                {maxNFTsReached && (
                  <span className="text-red-400 ml-2">(Maximum reached)</span>
                )}
              </div>
            )}

            {/* Show message for new users without collection */}
            {!hasCollection && (
              <div className="mt-1 text-sm text-blue-400">
                ✨ Mint your first NFT to start your collection!
              </div>
            )}
          </>
        )}
      </div>

      <button
        onClick={handleMint}
        disabled={!canMint}
        className={`w-full py-3.5 rounded-xl font-bold transition-all ${
          canMint
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/20'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {getButtonText()}
      </button>

      {hasCollection && maxNFTsReached && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
          <p className="text-sm text-red-300 text-center">
            You've reached the maximum of 20 NFTs per wallet. You cannot mint
            more NFTs from this wallet.
          </p>
        </div>
      )}
    </div>
  );
};

MintInterface.propTypes = {
  bagPrice: PropTypes.number,
  isWalletConnected: PropTypes.bool,
  userBalance: PropTypes.number,
  userNFTCount: PropTypes.number,
  hasCollection: PropTypes.bool,
  maxNFTsReached: PropTypes.bool,
  onMint: PropTypes.func,
  minting: PropTypes.bool,
};

MintInterface.defaultProps = {
  bagPrice: 0,
  isWalletConnected: false,
  userBalance: 0,
  userNFTCount: 0,
  hasCollection: false,
  maxNFTsReached: false,
  onMint: () => {},
  minting: false,
};

export default MintInterface;
