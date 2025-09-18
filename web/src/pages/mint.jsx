import { useState, useEffect } from 'react';
import { useCurrentFlowUser } from '@onflow/kit';
import { mintNFT } from '../flow/Transaction/MintBag.tx';
import { parseFlowError } from '../utils/parseFlowError';

import Sidebar from '../component/Sidebar';
import AdditionalInfo from '../component/AdditionalInfo';
import MintInterface from '../component/MintInterface';
import toast from 'react-hot-toast';

import { getTotalSupply } from '../flow/Script/get_totalSupply.script';
import { getCheckCollection } from '../flow/Script/get_checkCollection.script';
import { getBagPrice } from '../flow/Script/get_bagPrice.script';
import { getFlowTokenBalance } from '../flow/Script/getFlowTokenBalance.script';
import { getMaxSupply } from '../flow/Script/get_maxSupply.script';

function Mint() {
  const { user } = useCurrentFlowUser();
  const [mintCount, setMintCount] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastMintedCount, setLastMintedCount] = useState(0);
  const [minting, setMinting] = useState(false);

  // State for contract data
  const [totalSupply, setTotalSupply] = useState(null);
  const [hasCollection, setHasCollection] = useState(false);
  const [bagPrice, setBagPrice] = useState(0);
  const [flowBalance, setFlowBalance] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [maxSupply, setMaxSupply] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  // Fetch contract data
  const refetchAll = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const [totalSupplyRes, bagPriceRes, maxSupplyRes, contractBalanceRes] =
        await Promise.all([getTotalSupply(), getBagPrice(), getMaxSupply()]);

      setTotalSupply(totalSupplyRes);
      setBagPrice(bagPriceRes);
      setMaxSupply(maxSupplyRes);

      if (user?.addr) {
        const [hasCollectionRes, flowBalanceRes] = await Promise.all([
          getCheckCollection(user.addr),
          getFlowTokenBalance('0x11106fe6700496e8'),
        ]);

        setHasCollection(hasCollectionRes);
        setContractBalance(flowBalanceRes);
        setFlowBalance(flowBalanceRes);
      } else {
        setHasCollection(false);
        setFlowBalance(0);
      }
    } catch (e) {
      setIsError(true);
      setError(e);
      console.error('Error fetching data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetchAll();
  }, [user?.addr]);

  const handleMint = async () => {
    if (!user || !bagPrice) return;
    setMinting(true);
    try {
      const amount = (bagPrice * mintCount).toFixed(2);
      await mintNFT(user.addr, amount, mintCount);
      setLastMintedCount(mintCount);
      setShowSuccess(true);
      refetchAll();
      setTimeout(() => setShowSuccess(false), 20000);
    } catch (e) {
      const message = parseFlowError(e);
      toast.error(message);
    } finally {
      setMinting(false);
    }
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
      <div className="min-h-screen flex items-center justify-center bg-[#12141D]">
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
          <p className="text-gray-400 mb-4">
            {error?.message || 'Unknown error occurred'}
          </p>
          <button
            onClick={refetchAll}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4">
            <Sidebar
              contractBalance={contractBalance}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Minting Stats Card */}
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

              {/* View NFTs Button */}
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

            {/* Minting Interface */}
            <MintInterface
              setMintCount={setMintCount}
              mintCount={mintCount}
              minting={minting}
              bagPrice={bagPrice}
              handleMint={handleMint}
              isWalletConnected={!!user}
              minMint={1}
              maxMint={10}
            />

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 border border-green-700/50 rounded-2xl p-6 mt-6 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <h3 className="font-bold text-green-300 text-lg">
                    Successfully minted {lastMintedCount} NFT
                    {lastMintedCount > 1 ? 's' : ''}!
                  </h3>
                </div>
                <p className="text-green-200 mb-4">
                  Your NFT{lastMintedCount > 1 ? 's have' : ' has'} been minted
                  successfully. You can view{' '}
                  {lastMintedCount > 1 ? 'them' : 'it'} on FlowView once the
                  metadata is processed.
                </p>
                <a
                  href={`https://testnet.flowview.app/account/${user?.addr}/collection/GullyBagCollection`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors"
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
                  View on FlowView
                </a>
              </div>
            )}

            {/* Additional Info */}
            <AdditionalInfo />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Mint;
