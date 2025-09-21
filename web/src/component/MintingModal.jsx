import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

// Transaction status state machine
const TRANSACTION_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  FINALIZED: 'finalized',
  EXECUTED: 'executed',
  SEALED: 'sealed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  DECLINED: 'declined',
};

const statusMessages = {
  [TRANSACTION_STATUS.IDLE]: 'Preparing transaction...',
  [TRANSACTION_STATUS.PENDING]: 'Transaction submitted to blockchain...',
  [TRANSACTION_STATUS.FINALIZED]:
    'Transaction finalized, waiting for execution...',
  [TRANSACTION_STATUS.EXECUTED]: 'Transaction executed, confirming results...',
  [TRANSACTION_STATUS.SEALED]: 'Transaction sealed and confirmed!',
  [TRANSACTION_STATUS.FAILED]: 'Transaction failed',
  [TRANSACTION_STATUS.CANCELLED]: 'Transaction cancelled',
  [TRANSACTION_STATUS.DECLINED]: 'Transaction declined',
};

const getProgressPercentage = (status) => {
  switch (status) {
    case TRANSACTION_STATUS.PENDING:
      return 25;
    case TRANSACTION_STATUS.FINALIZED:
      return 50;
    case TRANSACTION_STATUS.EXECUTED:
      return 75;
    case TRANSACTION_STATUS.SEALED:
      return 100;
    case TRANSACTION_STATUS.FAILED:
      return 100;
    case TRANSACTION_STATUS.CANCELLED:
      return 100;
    case TRANSACTION_STATUS.DECLINED:
      return 25;
    default:
      return 2;
  }
};

const getCleanErrorMessage = (error) => {
  if (!error) return '';
  if (typeof error === 'object' && error.message) return error.message;
  if (typeof error === 'string') {
    const match = error.match(/pre-condition failed: ([^>]+)/);
    if (match && match[1]) return `pre-condition failed: ${match[1].trim()}`;
    return error;
  }
  return 'Transaction failed. Please try again.';
};

const MintingModal = ({
  isOpen = false,
  onClose,
  onRetry,
  transactionStatus = TRANSACTION_STATUS.IDLE,
  transactionId = null,
  error = null,
  mintCount = 1,
  minting = false,
  transactionSubmitted = false,
  showSuccess = false,
  onCloseSuccess,
}) => {
  const modalRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayTransactionId =
    typeof transactionId === 'string'
      ? transactionId
      : transactionId?.toString?.() || '';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-[#1A1D28] rounded-2xl p-6 w-full max-w-md border border-[#2A2D3A] shadow-xl relative"
      >
        {/* Success Overlay */}
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
              onClick={onCloseSuccess}
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
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Minting NFTs
        </h3>

        <div className="mb-6">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">
              {statusMessages[transactionStatus]}
            </span>
            <span className="text-sm font-medium text-gray-300">
              {getProgressPercentage(transactionStatus)}%
            </span>
          </div>
          <div className="w-full bg-[#2A2D3A] rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage(transactionStatus)}%` }}
            ></div>
          </div>
        </div>

        {displayTransactionId && (
          <div className="mb-5 p-3 bg-[#232734] rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Transaction ID:</p>
            <p className="text-xs font-mono text-blue-400 break-all">
              {displayTransactionId}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <a
                href={`https://testnet.flowscan.io/tx/${displayTransactionId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                View on Flowscan
              </a>
            </p>
          </div>
        )}

        {error && transactionStatus !== TRANSACTION_STATUS.DECLINED && (
          <div className="mb-5 p-3 bg-red-900/30 rounded-lg border border-red-700/50">
            <p className="text-sm text-red-300">
              {getCleanErrorMessage(error)}
            </p>
          </div>
        )}

        {transactionStatus === TRANSACTION_STATUS.DECLINED && (
          <div className="mb-5 p-3 bg-orange-900/30 rounded-lg border border-orange-700/50">
            <p className="text-sm text-orange-300">
              Transaction was declined in your wallet.
            </p>
          </div>
        )}

        {transactionStatus === TRANSACTION_STATUS.CANCELLED && (
          <div className="mb-5 p-3 bg-yellow-900/30 rounded-lg border border-yellow-700/50">
            <p className="text-sm text-yellow-300">
              Transaction was cancelled. It may still process on the blockchain.
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {transactionStatus === TRANSACTION_STATUS.SEALED && !showSuccess && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
            >
              Done
            </button>
          )}

          {transactionStatus === TRANSACTION_STATUS.FAILED && (
            <>
              <button
                onClick={() => onRetry(mintCount)}
                disabled={minting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {minting ? 'Retrying...' : 'Try Again'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </>
          )}

          {transactionStatus === TRANSACTION_STATUS.DECLINED && (
            <>
              <button
                onClick={() => onRetry(mintCount)}
                disabled={minting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {minting ? 'Retrying...' : 'Try Again'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </>
          )}

          {transactionStatus === TRANSACTION_STATUS.CANCELLED && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          )}

          {(transactionStatus === TRANSACTION_STATUS.PENDING ||
            transactionStatus === TRANSACTION_STATUS.IDLE) && (
            <button
              onClick={onClose}
              disabled={transactionSubmitted}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                transactionSubmitted
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {transactionSubmitted ? 'Cannot Cancel' : 'Cancel Transaction'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

MintingModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  transactionStatus: PropTypes.oneOf(Object.values(TRANSACTION_STATUS)),
  transactionId: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  mintCount: PropTypes.number,
  minting: PropTypes.bool,
  transactionSubmitted: PropTypes.bool,
  showSuccess: PropTypes.bool,
  onCloseSuccess: PropTypes.func,
};

MintingModal.defaultProps = {
  isOpen: false,
  transactionStatus: TRANSACTION_STATUS.IDLE,
  mintCount: 1,
  minting: false,
  transactionSubmitted: false,
  showSuccess: false,
};

export default MintingModal;
