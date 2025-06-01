import { useCurrentFlowUser, useFlowAccount } from "@onflow/kit";
import { useState, useEffect } from "react";
import { getFlowTokenBalance } from "../flow/Script/getFlowTokenBalance.script";

const Auth = () => {
  const { user, authenticate, unauthenticate } = useCurrentFlowUser();
  const [isOpen, setIsOpen] = useState(false);
  const [userFlowBalance, setUserFlowBalance] = useState(null);
  const {
    data: account,
    isLoading,
    error,
    refetch,
  } = useFlowAccount({
    address: user?.addr,
    query: { staleTime: 5000 },
  });

  useEffect(() => {
    async function fetchBalance() {
      if (user?.addr) {
        try {
          const bal = await getFlowTokenBalance(user.addr);
          setUserFlowBalance(Number(bal));
        } catch (e) {
          setUserFlowBalance(null);
        }
      }
    }
    fetchBalance();
  }, [user?.addr]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(user?.addr);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const handleDisconnect = async () => {
    try {
      await unauthenticate();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  if (!user?.loggedIn) {
    return (
      <button
        onClick={authenticate}
        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <span>
          {user?.addr?.slice(0, 6)}...{user?.addr?.slice(-4)}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Connected Wallet</div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{user?.addr}</span>
              <button
                onClick={copyToClipboard}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Copy address"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Account Details */}
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Account Details</div>
            {isLoading ? (
              <div className="text-sm text-gray-600">Loading account...</div>
            ) : error ? (
              <div className="text-sm text-red-600">Error: {error.message}</div>
            ) : account ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Balance:</span>
                  <span className="text-sm font-medium">
                    {account.balance} FLOW
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Flow Balance:</span>
                  <span className="text-sm font-medium">
                    {userFlowBalance !== null
                      ? userFlowBalance + " FLOW"
                      : "..."}
                  </span>
                </div>
                <button
                  onClick={refetch}
                  className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-600">No account data</div>
            )}
          </div>

          <button
            onClick={handleDisconnect}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;
