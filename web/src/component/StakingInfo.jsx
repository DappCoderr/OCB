import { useCurrentFlowUser } from '@onflow/kit';
import { ADMIN_ADDRESS } from '../utils/constants';

const StakingInfo = () => {
  const { user } = useCurrentFlowUser();
  const isAdmin = user?.addr === ADMIN_ADDRESS;

  return (
    <div className="bg-gradient-to-br from-[#1A1D28] to-[#1E212E] rounded-2xl p-6 border border-[#2A2D3A] shadow-lg backdrop-blur-sm">
      <h3 className="font-semibold text-white text-lg mb-5 flex items-center">
        <svg
          className="w-5 h-5 mr-2.5 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Token Delegate
      </h3>

      <div className="space-y-4">
        {/* <div className="flex justify-between items-center py-2 px-3 bg-[#232734] rounded-lg">
          <span className="text-gray-300 text-sm">Committed:</span>
          <span className="font-semibold text-white">1000 FLOW</span>
        </div> */}

        <div className="flex justify-between items-center py-2 px-3 bg-[#232734] rounded-lg">
          <span className="text-gray-300 text-sm">Staked:</span>
          <span className="font-semibold text-white">699930 FLOW</span>
        </div>

        <div className="flex justify-between items-center py-2 px-3 bg-[#232734] rounded-lg">
          <span className="text-gray-300 text-sm">Rewarded:</span>
          <span className="font-semibold text-green-400">1184 FLOW</span>
        </div>

        <div className="flex justify-between items-center py-2 px-3 bg-[#232734] rounded-lg">
          <span className="text-gray-300 text-sm">APY (approx):</span>
          <span className="font-semibold text-blue-400">11%</span>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="mt-6 pt-5 border-t border-[#3A3D4A]">
            <div className="flex items-center mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#3A3D4A] mr-3"></div>
              <span className="text-sm font-medium text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Admin Controls
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#3A3D4A] ml-3"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className="group relative py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-sm font-medium transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/20 flex items-center justify-center">
                <span className="relative z-10">Stake New Tokens</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
              </button>

              <button className="group relative py-2.5 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl text-sm font-medium transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-purple-500/20 flex items-center justify-center">
                <span className="relative z-10">Claim Reward</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StakingInfo;
