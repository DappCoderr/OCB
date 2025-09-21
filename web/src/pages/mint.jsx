import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFlowUser } from '@onflow/kit';
import * as fcl from '@onflow/fcl';
import { useState, useEffect, useRef } from 'react';
import Sidebar from '../component/Sidebar';
import AdditionalInfo from '../component/AdditionalInfo';
import MintInterface from '../component/MintInterface';
import MintingModal from '../component/MintingModal';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

import { getTotalSupply } from '../flow/Script/get_totalSupply.script';
import { getCheckCollection } from '../flow/Script/get_checkCollection.script';
import { getBagPrice } from '../flow/Script/get_bagPrice.script';
import { getFlowTokenBalance } from '../flow/Script/getFlowTokenBalance.script';
import { getMaxSupply } from '../flow/Script/get_maxSupply.script';
import { getCollectionLength } from '../flow/Script/get_collectionLength.script';
import { mintNFT } from '../flow/Transaction/MintBag.tx';
import { parseFlowError } from '../utils/parseFlowError';
import Footer from '../component/Footer';

// Confetti function
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

function Mint() {
  const { user } = useCurrentFlowUser();
  const queryClient = useQueryClient();
  const [mintingModalOpen, setMintingModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(
    TRANSACTION_STATUS.IDLE
  );
  const [transactionId, setTransactionId] = useState(null);
  const [mintError, setMintError] = useState(null);
  const [lastMintedCount, setLastMintedCount] = useState(0);
  const [transactionSubmitted, setTransactionSubmitted] = useState(false);

  // Use ref for latest state to avoid closure issues
  const transactionStatusRef = useRef(transactionStatus);
  const unsubscribeRef = useRef(null);

  // Keep ref in sync with state
  useEffect(() => {
    transactionStatusRef.current = transactionStatus;
  }, [transactionStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Fetch all contract data
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['contract-data', user?.addr],
    queryFn: async () => {
      const [totalSupply, bagPrice, maxSupply, contractBalance] =
        await Promise.all([
          getTotalSupply(),
          getBagPrice(),
          getMaxSupply(),
          getFlowTokenBalance('0x11106fe6700496e8'),
        ]);

      let hasCollection = false;
      let flowBalance = 0;
      let userNFTCount = 0;

      if (user?.addr) {
        try {
          [hasCollection, flowBalance, userNFTCount] = await Promise.all([
            getCheckCollection(user.addr),
            getFlowTokenBalance(user.addr),
            getCollectionLength(user.addr).catch(() => 0), // Return 0 if collection doesn't exist
          ]);
        } catch (error) {
          // Handle case where user doesn't have a collection yet
          if (error.message.includes('does not have a Bag collection')) {
            hasCollection = false;
            userNFTCount = 0;
          } else {
            throw error;
          }
        }
      }

      return {
        totalSupply,
        bagPrice,
        maxSupply,
        contractBalance,
        hasCollection: Boolean(hasCollection),
        flowBalance,
        userNFTCount,
        maxNFTsReached: userNFTCount >= 20,
      };
    },
    enabled: !!user?.addr,
    retry: (failureCount, error) => {
      // Don't retry if it's a "no collection" error
      if (error.message.includes('does not have a Bag collection')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Track transaction
  const trackTransaction = async (txId) => {
    try {
      setTransactionStatus(TRANSACTION_STATUS.PENDING);

      const unsubscribe = fcl.tx(txId).subscribe((transaction) => {
        // Check if transaction was cancelled using ref for latest value
        if (transactionStatusRef.current === TRANSACTION_STATUS.CANCELLED) {
          unsubscribe();
          return;
        }

        console.log('Transaction update:', transaction.status, transaction);

        switch (transaction.status) {
          case 1: // PENDING
            setTransactionStatus(TRANSACTION_STATUS.PENDING);
            break;
          case 2: // FINALIZED
            setTransactionStatus(TRANSACTION_STATUS.FINALIZED);
            break;
          case 3: // EXECUTED
            setTransactionStatus(TRANSACTION_STATUS.EXECUTED);
            break;
          case 4: // SEALED
            if (transaction.errorMessage) {
              // Handle user declined transaction specifically
              if (transaction.errorMessage.toLowerCase().includes('declined')) {
                setTransactionStatus(TRANSACTION_STATUS.DECLINED);
                setMintError('Transaction declined by user');
                toast.error('Transaction was declined');
              } else {
                setTransactionStatus(TRANSACTION_STATUS.FAILED);
                setMintError(transaction.errorMessage);
                toast.error('Transaction failed');
              }
            } else {
              setTransactionStatus(TRANSACTION_STATUS.SEALED);
              toast.success('NFTs minted successfully!');
              queryClient.invalidateQueries(['contract-data']);
            }
            unsubscribe();
            break;
          case 5: // EXPIRED
            setTransactionStatus(TRANSACTION_STATUS.FAILED);
            setMintError('Transaction expired');
            toast.error('Transaction expired');
            unsubscribe();
            break;
          default:
            break;
        }
      });

      unsubscribeRef.current = unsubscribe;
    } catch (error) {
      console.error('Error tracking transaction:', error);
      setTransactionStatus(TRANSACTION_STATUS.FAILED);
      setMintError(error.message);
      toast.error('Error tracking transaction');
    }
  };

  // Mint mutation
  const mintMutation = useMutation({
    mutationFn: async ({ mintCount }) => {
      if (!user || !data?.bagPrice)
        throw new Error('User not connected or price not available');
      const amount = (data.bagPrice * mintCount).toFixed(2);
      const transactionId = await mintNFT(user.addr, amount, mintCount);
      setTransactionSubmitted(true); // Transaction has been submitted to wallet
      return transactionId;
    },
    onMutate: (variables) => {
      setMintingModalOpen(true);
      setTransactionStatus(TRANSACTION_STATUS.IDLE);
      setMintError(null);
      setTransactionSubmitted(false);
      setLastMintedCount(variables.mintCount);
    },
    onSuccess: (transactionId) => {
      setTransactionId(transactionId);
      trackTransaction(transactionId);
    },
    onError: (error) => {
      setTransactionStatus(TRANSACTION_STATUS.FAILED);
      const message = parseFlowError(error);
      setMintError(message);
      toast.error(message);
    },
  });

  const handleMint = (mintCount) => {
    mintMutation.mutate({ mintCount });
  };

  const handleCancelMint = () => {
    // Don't allow cancellation if transaction is already submitted to wallet
    if (transactionSubmitted) {
      toast.error('Transaction already submitted. Cannot cancel now.');
      return;
    }

    if (
      [TRANSACTION_STATUS.IDLE, TRANSACTION_STATUS.PENDING].includes(
        transactionStatus
      )
    ) {
      if (
        window.confirm(
          'Are you sure you want to cancel? The transaction may still process on the blockchain.'
        )
      ) {
        // Stop tracking the transaction
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }

        setMintingModalOpen(false);
        setTransactionStatus(TRANSACTION_STATUS.CANCELLED);
        setMintError('Transaction cancelled by user');
        queryClient.invalidateQueries(['contract-data']);
      }
    } else {
      setMintingModalOpen(false);
    }
  };

  const handleRetryMint = (mintCount) => {
    setMintError(null);
    setTransactionStatus(TRANSACTION_STATUS.IDLE);
    setTransactionSubmitted(false);
    mintMutation.mutate({ mintCount });
  };

  const handleCloseSuccess = () => {
    setMintingModalOpen(false);
    setTransactionStatus(TRANSACTION_STATUS.IDLE);
    setTransactionId(null);
    setMintError(null);
  };

  const getCleanErrorMessage = (error) => {
    if (!error) return 'Unknown error occurred';

    const message =
      typeof error === 'object'
        ? error.message || error.errorMessage || JSON.stringify(error)
        : String(error);

    // Handle "no collection" error specifically
    if (message.includes('does not have a Bag collection')) {
      return "You don't have a collection yet. Minting your first NFT will create one automatically!";
    }

    const match = message.match(/pre-condition failed: ([^>]+)/);
    return match && match[1]
      ? `pre-condition failed: ${match[1].trim()}`
      : message;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-[#1A1D28] rounded-2xl border border-[#2A2D3A] shadow-lg">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-400 mb-4">{getCleanErrorMessage(error)}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const {
    totalSupply,
    bagPrice,
    maxSupply,
    contractBalance,
    hasCollection,
    flowBalance,
    userNFTCount,
    maxNFTsReached,
  } = data || {};

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center ml-44 mb-8">
          <p className="text-gray-600 max-w-xl mx-auto">
            It's your shot at{' '}
            <span className="text-rose-600 font-semibold animate-pulse">
              13× Richer!
            </span>
            <br />A true digital ownership with the power to pay.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4">
            <Sidebar
              flowBalance={flowBalance}
              contractBalance={contractBalance}
            />
          </div>

          <div className="flex-1">
            <div className="bg-[#1A1D28] rounded-2xl p-6 mb-6 border border-[#2A2D3A] shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Minted:</span>
                <span className="font-bold text-white">
                  {totalSupply?.toLocaleString()} /{' '}
                  {maxSupply?.toLocaleString()}
                </span>
              </div>

              <div className="w-full bg-[#2A2D3A] rounded-full h-2.5 mb-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${((totalSupply || 0) / (maxSupply || 1)) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="text-center text-sm text-gray-400 mb-4">
                {(((totalSupply || 0) / (maxSupply || 1)) * 100).toFixed(1)}%
                minted
              </div>

              {user?.addr && hasCollection && (
                <div className="flex justify-center mt-4">
                  <a
                    href={`https://testnet.flowview.app/account/${user.addr}/collection/GullyBagCollection`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full shadow-lg hover:from-green-700 hover:to-teal-700 transition-all transform hover:-translate-y-0.5"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View your NFTs on FlowView
                  </a>
                </div>
              )}
            </div>

            <MintInterface
              bagPrice={bagPrice}
              isWalletConnected={!!user}
              userBalance={flowBalance}
              userNFTCount={userNFTCount}
              hasCollection={hasCollection}
              maxNFTsReached={maxNFTsReached}
              onMint={handleMint}
              minting={mintMutation.isPending}
            />

            <MintingModal
              isOpen={mintingModalOpen}
              onClose={handleCancelMint}
              onRetry={handleRetryMint}
              transactionStatus={transactionStatus}
              transactionId={transactionId}
              error={mintError}
              mintCount={lastMintedCount}
              minting={mintMutation.isPending}
              transactionSubmitted={transactionSubmitted}
              showSuccess={transactionStatus === TRANSACTION_STATUS.SEALED}
              onCloseSuccess={handleCloseSuccess}
            />

            <AdditionalInfo />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Mint;
