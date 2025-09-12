import { useState, useEffect } from 'react';
import { useCurrentFlowUser } from '@onflow/kit';
import { mintNFT } from '../flow/Transaction/Mint.tx'
import { parseFlowError } from '../utils/parseFlowError';

import Sidebar from '../component/Sidebar'
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
  const [contractBalance, setContractBalance] = useState(0); // Add contract balance state
  const [maxSupply, setMaxSupply] = useState(null); // Change to dynamic max supply
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  // Fetch contract data
  const refetchAll = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      // Fetch general contract data (doesn't require user address)
      const [totalSupplyRes, bagPriceRes, maxSupplyRes, contractBalanceRes] = await Promise.all([
        getTotalSupply(),
        getBagPrice(),
        getMaxSupply(),
      ]);
      
      setTotalSupply(totalSupplyRes);
      setBagPrice(bagPriceRes);
      setMaxSupply(maxSupplyRes);
      
      // Only fetch user-specific data if user is connected
      if (user?.addr) {
        const [
          hasCollectionRes,
          flowBalanceRes
        ] = await Promise.all([
          getCheckCollection(user.addr),
          getFlowTokenBalance("0x337e140cac71c1f0")
        ]);
        
        setHasCollection(hasCollectionRes);
        setContractBalance(flowBalanceRes);
        setFlowBalance(flowBalanceRes);
      } else {
        // Reset user-specific data
        setHasCollection(false);
        setFlowBalance(0);
      }
    } catch (e) {
      setIsError(true);
      setError(e);
      console.error("Error fetching data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetchAll();
  }, [user?.addr]); // Only refetch when user address changes

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
    return <div className="text-center py-12">Loading data...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading contract data: {error?.message}</p>
        <button 
          onClick={refetchAll}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <p className="text-gray-600 mb-4 text-base">
          More than an NFT — it's your shot at{" "}
          <span className="inline-block animate-shake text-red-500 font-bold">
            13× Richer!
          </span>
          <br />
          A true digital ownership with the power to pay.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 border border-red-300 text-red-800 text-center font-semibold animate-pulse text-sm">
          {error.message}
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Pass both flowBalance and contractBalance */}
        <Sidebar flowBalance={flowBalance} contractBalance={contractBalance} />

        {/* Main Content - Minting Interface */}
        <div className="flex-1">
          {/* Minting Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">Minted:</span>
              <span className="font-bold text-base">
                {totalSupply?.toLocaleString()} / {maxSupply?.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((totalSupply || 0) / (maxSupply || 1)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-center text-xs text-gray-500 mb-2">
              {(((totalSupply || 0) / (maxSupply || 1)) * 100).toFixed(1)}%
              minted
            </div>
            
            {/* Contract Balance Display */}
            {/* <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <span className="text-gray-600 text-sm">Contract Balance:</span>
              <span className="font-bold text-base text-green-600">
                {contractBalance?.toFixed(2)} FLOW
              </span>
            </div> */}
            
            {/* Centered View NFTs Button */}
            {user?.addr && hasCollection && (
              <div className="flex justify-center mt-2">
                <a
                  href={`https://testnet.flowview.app/account/${user.addr}/collection/GullyBagCollection`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition-colors font-semibold text-sm"
                  style={{ minWidth: 180 }}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16l-5.152 8.416a.756.756 0 01-1.296 0L5.968 8.16a.756.756 0 01.648-1.152h10.304a.756.756 0 01.648 1.152z" />
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
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
                <h3 className="font-bold text-green-800 text-base">
                  Successfully minted {lastMintedCount} NFT
                  {lastMintedCount > 1 ? 's' : ''}!
                </h3>
              </div>
              <p className="text-green-700 mb-4 text-sm">
                Your NFT{lastMintedCount > 1 ? 's have' : ' has'} been minted
                successfully. You can view {lastMintedCount > 1 ? 'them' : 'it'}{' '}
                on FlowView once the metadata is processed.
              </p>
              <a
                href={`https://testnet.flowview.app/account/${user?.addr}/collection/GullyBagCollection`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16l-5.152 8.416a.756.756 0 01-1.296 0L5.968 8.16a.756.756 0 01.648-1.152h10.304a.756.756 0 01.648 1.152z" />
                </svg>
                View on FlowView
              </a>
            </div>
          )}

          {/* Additional Info */}
          <AdditionalInfo />
        </div>
      </div>
    </main>
  );
}

export default Mint;