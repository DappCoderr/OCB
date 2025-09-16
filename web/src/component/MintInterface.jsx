import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as fcl from '@onflow/fcl';
import { MINT } from '../flow/Transaction/Mint.tx';
import { getFlowTokenBalance } from '../flow/Script/getFlowTokenBalance.script';
import { getCollectionLength } from '../flow/Script/get_collectionLength.script';
import confetti from 'canvas-confetti';

const MintInterface = ({
  setMintCount,
  mintCount,
  minting,
  bagPrice,
  isWalletConnected,
  minMint = 1,
  maxMint = 10,
  onRefreshData,
}) => {
  const [showMintingModal, setShowMintingModal] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('idle');
  const [transactionId, setTransactionId] = useState(null);
  const [error, setError] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [userNFTCount, setUserNFTCount] = useState(0);
  const [maxNFTsReached, setMaxNFTsReached] = useState(false);

  const statusMessages = {
    idle: 'Preparing transaction...',
    pending: 'Transaction submitted to blockchain...',
    finalized: 'Transaction finalized, waiting for execution...',
    executed: 'Transaction executed, confirming results...',
    sealed: 'Transaction sealed and confirmed!',
    failed: 'Transaction failed',
  };

  useEffect(() => {
    const checkBalanceAndNFTs = async () => {
      if (!isWalletConnected) {
        setUserBalance(0);
        setUserNFTCount(0);
        setMaxNFTsReached(false);
        return;
      }

      setIsCheckingBalance(true);
      try {
        const user = await fcl.currentUser().snapshot();
        if (user.addr) {
          // Get user's FLOW balance
          const balance = await getFlowTokenBalance(user.addr);
          setUserBalance(balance);
          
          // Get user's NFT collection length
          const nftCount = await getCollectionLength(user.addr);
          setUserNFTCount(nftCount);
          
          // Check if user has reached the maximum (20 NFTs)
          setMaxNFTsReached(nftCount >= 20);
        }
      } catch (error) {
        console.error('Error checking FLOW balance or NFT count:', error);
      } finally {
        setIsCheckingBalance(false);
      }
    };

    checkBalanceAndNFTs();
  }, [isWalletConnected]);

  const totalCost = bagPrice * mintCount;
  const hasSufficientBalance = userBalance >= totalCost;
  const canMint = hasSufficientBalance && !maxNFTsReached;

  // Fire confetti animation
  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00ef8b', '#0090ff', '#ff00aa', '#ffd700', '#00e5ff'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
    }, 250);

    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 400);
  };

  // Mint NFT function
  const mintNFT = async (user, amount, mintQty) => {
    try {
      const response = await fcl.mutate({
        cadence: MINT,
        args: (arg, t) => [
          arg(user, t.Address),
          arg(amount, t.UFix64),
          arg(mintQty, t.UInt64),
        ],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });

      // Set the transaction ID for tracking
      setTransactionId(response);

      // Return the transaction response for tracking
      return response;
    } catch (error) {
      const msg =
        (typeof error === 'string' && error) ||
        (error && error.message) ||
        (error && error.errorMessage) ||
        'Transaction failed';

      if (msg.toLowerCase().includes('declined')) {
        throw new Error('User denied transaction');
      }
      throw new Error(msg);
    }
  };

  // Track transaction status
  const trackTransaction = async (txId) => {
    try {
      setTransactionStatus('pending');

      const unsubscribe = fcl.tx(txId).subscribe((transaction) => {
        if (transaction.status === 1) {
          // Pending
          setTransactionStatus('pending');
        } else if (transaction.status === 2) {
          // Finalized
          setTransactionStatus('finalized');
        } else if (transaction.status === 3) {
          // Executed
          setTransactionStatus('executed');
        } else if (transaction.status === 4) {
          // Sealed
          setTransactionStatus('sealed');

          // Check if transaction was successful
          if (transaction.errorMessage) {
            setTransactionStatus('failed');
            setError(transaction.errorMessage);

            if (onRefreshData) {
              onRefreshData();
            }
          } else {
            setShowSuccess(true);
            fireConfetti();

            if (onRefreshData) {
              onRefreshData();
            }

            setTimeout(() => {
              setShowMintingModal(false);
              setIsMinting(false);
              setShowSuccess(false);
            }, 3000);
          }

          unsubscribe();
        }
      });
    } catch (error) {
      setTransactionStatus('failed');
      setError(error.message);
      setIsMinting(false);

      if (onRefreshData) {
        onRefreshData();
      }
    }
  };

  // Handle the mint process
  const handleMint = async () => {
    setShowMintingModal(true);
    setTransactionStatus('idle');
    setError(null);
    setIsMinting(true);
    setShowSuccess(false);

    try {
      const user = await fcl.currentUser().snapshot();

      if (!user.addr) {
        throw new Error('No user connected');
      }

      const totalAmount = (bagPrice * mintCount).toFixed(8);

      const txId = await mintNFT(user.addr, totalAmount, mintCount);

      trackTransaction(txId);
    } catch (err) {
      setTransactionStatus('failed');
      setError(err.message);
      setIsMinting(false);
      if (onRefreshData) {
        onRefreshData();
      }
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    setShowMintingModal(false);
    setTransactionStatus('idle');
    setError(null);
    setIsMinting(false);
    setShowSuccess(false);
    if (onRefreshData) {
      onRefreshData();
    }
  };

  // Get progress percentage based on status
  const getProgressPercentage = () => {
    switch (transactionStatus) {
      case 'pending':
        return 25;
      case 'finalized':
        return 50;
      case 'executed':
        return 75;
      case 'sealed':
        return 100;
      case 'failed':
        return 100;
      default:
        return 2;
    }
  };

  const getCleanErrorMessage = (error) => {
    if (!error) return '';
    const match = error.match(/pre-condition failed: ([^>]+)/);
    if (match && match[1]) {
      return `pre-condition failed: ${match[1].trim()}`;
    }
    return 'Transaction failed. Please try again.';
  };

  // Get button text based on conditions
  const getButtonText = () => {
    if (isMinting) return 'Minting...';
    if (!isWalletConnected) return 'Connect Wallet to Mint';
    if (maxNFTsReached) return 'Max NFTs Reached (20/20)';
    if (!hasSufficientBalance) return 'Insufficient Balance';
    return `Mint ${mintCount} NFT${mintCount > 1 ? 's' : ''}`;
  };

  return (
    <>
      <div className="bg-[#1A1D28] rounded-2xl p-6 border border-[#2A2D3A] shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <label className="font-semibold text-gray-300">Quantity:</label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMintCount(Math.max(minMint, mintCount - 1))}
              className="w-9 h-9 border border-[#2A2D3A] bg-[#232734] rounded-lg hover:bg-[#2A2D3A] transition-colors font-bold flex items-center justify-center"
              disabled={isMinting || maxNFTsReached}
            >
              -
            </button>
            <span className="w-12 text-center font-bold text-white text-lg">
              {mintCount}
            </span>
            <button
              onClick={() => setMintCount(Math.min(maxMint, mintCount + 1))}
              className="w-9 h-9 border border-white bg-white rounded-lg hover:bg-[#2A2D3A] transition-colors font-bold flex items-center justify-center"
              disabled={isMinting || maxNFTsReached}
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
            <span className="text-white">{bagPrice * mintCount} FLOW</span>
          </div>

          {isWalletConnected && (
            <div className="mt-2 text-sm text-gray-400">
              Your balance: {userBalance} FLOW
              {!hasSufficientBalance && (
                <span className="text-red-400 ml-2">
                  (Insufficient balance)
                </span>
              )}
            </div>
          )}

          {isWalletConnected && (
            <div className="mt-1 text-sm text-gray-400">
              Your NFTs: {userNFTCount}/20
              {maxNFTsReached && (
                <span className="text-red-400 ml-2">
                  (Maximum reached)
                </span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleMint}
          disabled={!isWalletConnected || isMinting || !canMint}
          className={`w-full py-3.5 rounded-xl font-bold transition-all ${
            isWalletConnected && !isMinting && canMint
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/20'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {getButtonText()}
        </button>

        {/* Max NFTs Warning */}
        {maxNFTsReached && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
            <p className="text-sm text-red-300 text-center">
              You've reached the maximum of 20 NFTs per wallet. 
              You cannot mint more NFTs from this wallet.
            </p>
          </div>
        )}
      </div>

      {/* Minting Progress Modal */}
      {showMintingModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1D28] rounded-2xl p-6 w-full max-w-md border border-[#2A2D3A] shadow-xl relative">
            {showSuccess && (
              <div className="absolute inset-0 bg-green-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-10 p-6">
                <div className="text-green-400 text-6xl mb-4 animate-bounce">
                  🎉
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center">
                  Successfully Minted!
                </h3>
                <p className="text-green-200 text-center mb-6">
                  You have successfully minted {mintCount} NFT
                  {mintCount > 1 ? 's' : ''}
                </p>
                <button
                  onClick={() => {
                    setShowMintingModal(false);
                    setShowSuccess(false);
                  }}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-colors"
                >
                  Awesome!
                </button>
              </div>
            )}

            <h3 className="text-xl font-bold text-white mb-5 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLineend="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Minting NFTs
            </h3>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-gray-300">
                  {statusMessages[transactionStatus]}
                </span>
                <span className="text-sm font-medium text-gray-300">
                  {getProgressPercentage()}%
                </span>
              </div>
              <div className="w-full bg-[#2A2D3A] rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>

            {/* Transaction ID */}
            {transactionId && (
              <div className="mb-5 p-3 bg-[#232734] rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Transaction ID:</p>
                <p className="text-xs font-mono text-blue-400 break-all">
                  {transactionId}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  <a
                    href={`https://testnet.flowscan.io/tx/${transactionId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    View on Flowscan
                  </a>
                </p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-5 p-3 bg-red-900/30 rounded-lg border border-red-700/50">
                <p className="text-sm text-red-300">
                  {getCleanErrorMessage(error)}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end space-x-3">
              {transactionStatus === 'sealed' && !showSuccess && (
                <button
                  onClick={() => setShowMintingModal(false)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
                >
                  Done
                </button>
              )}

              {transactionStatus === 'failed' && (
                <>
                  <button
                    onClick={handleMint}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </>
              )}

              {transactionStatus !== 'sealed' &&
                transactionStatus !== 'failed' && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

MintInterface.propTypes = {
  setMintCount: PropTypes.func.isRequired,
  mintCount: PropTypes.number.isRequired,
  minting: PropTypes.bool.isRequired,
  bagPrice: PropTypes.number.isRequired,
  isWalletConnected: PropTypes.bool.isRequired,
  minMint: PropTypes.number,
  maxMint: PropTypes.number,
  onRefreshData: PropTypes.func,
};

MintInterface.defaultProps = {
  minMint: 1,
  maxMint: 10,
  onRefreshData: () => {},
};

export default MintInterface;