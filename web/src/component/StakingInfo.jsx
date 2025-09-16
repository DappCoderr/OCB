// import { NODE_ID, NODE_TYPE } from '../utils/constants';

// const StakingInfo = () => {
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-4">
//       <h3 className="font-semibold text-base mb-2 text-gray-700 tracking-wide">
//         Token Delegate
//       </h3>
//       <div className="space-y-2">
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Committed:</span>
//           <span className="font-semibold">0 FLOW</span>
//         </div>
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Staked:</span>
//           <span className="font-semibold">0 FLOW</span>
//         </div>
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Rewarded:</span>
//           <span className="font-semibold text-green-600">0 FLOW</span>
//         </div>
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">APY: (approx)</span>
//           <span className="font-semibold text-blue-600">11%</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StakingInfo;

const StakingInfo = () => {
  return (
    <div className="bg-[#1A1D28] rounded-2xl p-6 border border-[#2A2D3A] shadow-lg">
      <h3 className="font-semibold text-white text-lg mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-yellow-400"
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
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Committed:</span>
          <span className="font-semibold text-white">0 FLOW</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Staked:</span>
          <span className="font-semibold text-white">0 FLOW</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Rewarded:</span>
          <span className="font-semibold text-green-400">0 FLOW</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">APY (approx):</span>
          <span className="font-semibold text-blue-400">11%</span>
        </div>

        {/* Action buttons */}
        <div className="pt-4 border-t border-[#2A2D3A] flex space-x-3">
          <button className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            Stake
          </button>
          <button className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
            Claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default StakingInfo;
