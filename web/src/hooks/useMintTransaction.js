import { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as fcl from '@onflow/fcl';
import { useCurrentFlowUser } from '@onflow/kit';
import toast from 'react-hot-toast';
import { mintNFT } from '../flow/Transaction/MintBag.tx';
import { parseFlowError } from '../utils/parseFlowError';
import { TRANSACTION_STATUS } from '../utils/constants';

export const useMintTransaction = (bagPrice) => {
  const { user } = useCurrentFlowUser();
  const queryClient = useQueryClient();

  const [transactionStatus, setTransactionStatus] = useState(
    TRANSACTION_STATUS.IDLE
  );
  const [transactionId, setTransactionId] = useState(null);
  const [mintError, setMintError] = useState(null);
  const [lastMintedCount, setLastMintedCount] = useState(0);
  const [transactionSubmitted, setTransactionSubmitted] = useState(false);
  const [mintingModalOpen, setMintingModalOpen] = useState(false);

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

  // Track transaction
  const trackTransaction = useCallback(
    async (txId) => {
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
                if (
                  transaction.errorMessage.toLowerCase().includes('declined')
                ) {
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
    },
    [queryClient]
  );

  // Mint mutation
  const mintMutation = useMutation({
    mutationFn: async ({ mintCount }) => {
      if (!user || !bagPrice) {
        throw new Error('User not connected or price not available');
      }
      const amount = (bagPrice * mintCount).toFixed(2);
      const transactionId = await mintNFT(user.addr, amount, mintCount);
      setTransactionSubmitted(true);
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

  const handleMint = useCallback(
    (mintCount) => {
      mintMutation.mutate({ mintCount });
    },
    [mintMutation]
  );

  const handleCancelMint = useCallback(() => {
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
  }, [transactionStatus, transactionSubmitted, queryClient]);

  const handleRetryMint = useCallback(
    (mintCount) => {
      setMintError(null);
      setTransactionStatus(TRANSACTION_STATUS.IDLE);
      setTransactionSubmitted(false);
      mintMutation.mutate({ mintCount });
    },
    [mintMutation]
  );

  const handleCloseSuccess = useCallback(() => {
    setMintingModalOpen(false);
    setTransactionStatus(TRANSACTION_STATUS.IDLE);
    setTransactionId(null);
    setMintError(null);
  }, []);

  return {
    // State
    transactionStatus,
    transactionId,
    mintError,
    lastMintedCount,
    transactionSubmitted,
    mintingModalOpen,

    // Actions
    handleMint,
    handleCancelMint,
    handleRetryMint,
    handleCloseSuccess,

    // Mutation state
    minting: mintMutation.isPending,

    // Setters for modal control
    setMintingModalOpen,
  };
};
