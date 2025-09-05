import { NODE_ID, NODE_TYPE } from '../utils/constants';

const StakingInfo = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-base mb-2 text-gray-700 tracking-wide">
        Token Delegate
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Committed:</span>
          <span className="font-semibold">0 FLOW</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Staked:</span>
          <span className="font-semibold">0 FLOW</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Rewarded:</span>
          <span className="font-semibold text-green-600">0 FLOW</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">APY: (approx)</span>
          <span className="font-semibold text-blue-600">11%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Node ID:</span>
          <span className="font-semibold text-blue-600">
            {NODE_ID.slice(0, 4)}...{NODE_ID.slice(-4)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Node Type:</span>
          <span className="font-semibold text-blue-600">{NODE_TYPE}</span>
        </div>
      </div>
    </div>
  );
};

export default StakingInfo;
