import { useCurrentFlowUser } from '@onflow/kit';
import Sidebar from '../component/Sidebar';
import AdditionalInfo from '../component/AdditionalInfo';
import MintInterface from '../component/MintInterface';
import MintingModal from '../component/MintingModal';
import { useContractData } from '../hooks/useContractData';
import { useMintTransaction } from '../hooks/useMintTransaction';
import { getCleanErrorMessage } from '../utils/errorHelpers';
import { TRANSACTION_STATUS } from '../utils/constants';

function Mint() {
  const { user } = useCurrentFlowUser();
  const { data, isLoading, isError, error, refetch } = useContractData();

  const {
    transactionStatus,
    transactionId,
    mintError,
    lastMintedCount,
    transactionSubmitted,
    mintingModalOpen,
    handleMint,
    handleCancelMint,
    handleRetryMint,
    handleCloseSuccess,
    minting,
    setMintingModalOpen,
  } = useMintTransaction(data?.bagPrice);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />;
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
    <main className="px-6 py-8">
      <div className="max-w-7xl mx-auto bg-black rounded-2xl">
        <div className="px-8 py-10">
          <Header />

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/4">
              <Sidebar
                flowBalance={flowBalance}
                contractBalance={contractBalance}
              />
            </div>

            <div className="flex-1">
              <MintProgress
                totalSupply={totalSupply}
                maxSupply={maxSupply}
                user={user}
                hasCollection={hasCollection}
              />

              <MintInterface
                bagPrice={Number(bagPrice)}
                isWalletConnected={!!user}
                userBalance={Number(flowBalance)}
                userNFTCount={Number(userNFTCount)}
                hasCollection={hasCollection}
                maxNFTsReached={maxNFTsReached}
                onMint={handleMint}
                minting={minting}
              />

              <MintingModal
                isOpen={mintingModalOpen}
                onClose={handleCancelMint}
                onRetry={handleRetryMint}
                transactionStatus={transactionStatus}
                transactionId={transactionId}
                error={mintError}
                mintCount={lastMintedCount}
                minting={minting}
                transactionSubmitted={transactionSubmitted}
                showSuccess={transactionStatus === TRANSACTION_STATUS.SEALED}
                onCloseSuccess={handleCloseSuccess}
              />

              <AdditionalInfo />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Sub-components for better organization
const LoadingState = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600">Loading data...</p>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
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
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const Header = () => (
  <div className="text-center ml-44 mb-8">
    <p className="text-white max-w-xl mx-auto">
      {/* It's your shot at{' '}
      <span className="text-rose-600 font-semibold animate-pulse">
        13× Richer!
      </span> */}
      <br />A true digital ownership with the power to pay back.
    </p>
  </div>
);

const MintProgress = ({ totalSupply, maxSupply, user, hasCollection }) => (
  <div className="bg-[#1A1D28] rounded-2xl p-6 mb-6 border border-[#2A2D3A] shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <span className="text-gray-400">Minted:</span>
      <span className="font-bold text-white">
        {totalSupply?.toLocaleString()} / {maxSupply?.toLocaleString()}
      </span>
    </div>

    <div className="w-full bg-[#2A2D3A] rounded-full h-2.5 mb-3">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${((totalSupply || 0) / (maxSupply || 1)) * 100}%` }}
      ></div>
    </div>

    <div className="text-center text-sm text-gray-400 mb-4">
      {(((totalSupply || 0) / (maxSupply || 1)) * 100).toFixed(1)}% minted
    </div>

    {user?.addr && hasCollection && (
      <div className="flex justify-center mt-4">
        <a
          href={`https://testnet.flowview.app/account/${user.addr}/collection/GullyBagCollection`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full shadow-lg hover:from-green-700 hover:to-teal-700 transition-all transform hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
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
);

export default Mint;
