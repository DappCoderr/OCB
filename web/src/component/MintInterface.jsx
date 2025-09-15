import { useState } from 'react';
import PropTypes from 'prop-types';
import * as fcl from '@onflow/fcl';
import { MINT } from '../flow/Transaction/Mint.tx';
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

  // Transaction status messages
  const statusMessages = {
    idle: 'Preparing transaction...',
    pending: 'Transaction submitted to blockchain...',
    finalized: 'Transaction finalized, waiting for execution...',
    executed: 'Transaction executed, confirming results...',
    sealed: 'Transaction sealed and confirmed!',
    failed: 'Transaction failed'
  };

  // Fire confetti animation
  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00ef8b', '#0090ff', '#ff00aa', '#ffd700', '#00e5ff']
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
    }, 250);
    
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);
  };

  // Mint NFT function
  const mintNFT = async (user, amount, mintQty) => {
    try {
      const response = await fcl.mutate({
        cadence: MINT,
        args: (arg, t) => [arg(user, t.Address), arg(amount, t.UFix64), arg(mintQty, t.UInt64)],
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
        if (transaction.status === 1) { // Pending
          setTransactionStatus('pending');
        } else if (transaction.status === 2) { // Finalized
          setTransactionStatus('finalized');
        } else if (transaction.status === 3) { // Executed
          setTransactionStatus('executed');
        } else if (transaction.status === 4) { // Sealed
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
    switch(transactionStatus) {
      case 'pending': return 25;
      case 'finalized': return 50;
      case 'executed': return 75;
      case 'sealed': return 100;
      case 'failed': return 100;
      default: return 2;
    }
  };

  const getCleanErrorMessage = (error) => {
    if (!error) return "";
    const match = error.match(/pre-condition failed: ([^>]+)/);
    if (match && match[1]) {
      return `pre-condition failed: ${match[1].trim()}`;
    }
    return "Transaction failed. Please try again.";
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="font-semibold text-sm">Quantity:</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMintCount(Math.max(minMint, mintCount - 1))}
              className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors font-bold text-base"
              disabled={isMinting}
            >
              -
            </button>
            <span className="w-10 text-center font-bold text-base">
              {mintCount}
            </span>
            <button
              onClick={() => setMintCount(Math.min(maxMint, mintCount + 1))}
              className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors font-bold text-base"
              disabled={isMinting}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-sm">Price:</span>
          <span className="font-semibold text-sm">{Math.round(bagPrice)} FLOW each</span>
        </div>
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex items-center justify-between text-base font-bold">
            <span>Total:</span>
            <span>{(bagPrice * mintCount).toFixed(2)} FLOW</span>
          </div>
        </div>
        <button
          onClick={handleMint}
          disabled={!isWalletConnected || isMinting}
          className={`w-full py-3 rounded font-bold transition-colors text-base ${
            isWalletConnected && !isMinting
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isMinting
            ? 'Minting...'
            : isWalletConnected
              ? `Mint ${mintCount} NFT${mintCount > 1 ? 's' : ''}`
              : 'Connect Wallet to Mint'}
        </button>
      </div>

      {/* Minting Progress Modal */}
      {showMintingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            {showSuccess && (
              <div className="absolute inset-0 bg-green-50 bg-opacity-90 flex flex-col items-center justify-center rounded-lg z-10 p-4">
                <div className="text-green-500 text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-green-800 mb-2 text-center">
                  Successfully Minted!
                </h3>
                <p className="text-green-600 text-center">
                  You have successfully minted {mintCount} NFT{mintCount > 1 ? 's' : ''}
                </p>
                <button
                  onClick={() => {
                    setShowMintingModal(false);
                    setShowSuccess(false);
                  }}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
                >
                  Awesome!
                </button>
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-4 text-gray-800">Minting NFTs</h3>
            
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {statusMessages[transactionStatus]}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {getProgressPercentage()}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
            
            {/* Transaction ID */}
            {transactionId && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Transaction ID:</p>
                <p className="text-xs font-mono text-blue-600 break-all">
                  {transactionId}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <a 
                    href={`https://testnet.flowscan.io/tx/${transactionId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-500"
                  >
                    View on Flowscan
                  </a>
                </p>
              </div>
            )}
            
            {/* Error message */}
            {error && (
            <div className="mb-4 p-3 bg-red-100 rounded-lg">
              <p className="text-sm text-red-600">
                {getCleanErrorMessage(error)}
              </p>
            </div>
          )}
            
            {/* Action buttons */}
            <div className="flex justify-end space-x-3">
              {transactionStatus === 'sealed' && !showSuccess && (
                <button
                  onClick={() => setShowMintingModal(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700"
                >
                  Done
                </button>
              )}
              
              {transactionStatus === 'failed' && (
                <>
                  <button
                    onClick={handleMint}
                    className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-medium hover:bg-gray-400"
                  >
                    Close
                  </button>
                </>
              )}
              
              {(transactionStatus !== 'sealed' && transactionStatus !== 'failed') && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-medium hover:bg-gray-400"
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