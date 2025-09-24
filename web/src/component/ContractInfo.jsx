import { FlowIcon } from './FlowIcon';

const ContractInfo = ({ contractBalance }) => {
  return (
    <div className="bg-[#1A1D28] rounded-2xl p-6 border border-[#2A2D3A] shadow-lg">
      <h3 className="font-semibold text-white mb-4 text-lg flex items-center">
        Bag Vault
      </h3>

      <div className="space-y-4">
        <div>
          <p className="flex gap-2 text-md text-white font-medium">
            Flow :{' '}
            {contractBalance !== null
              ? Math.floor(contractBalance).toLocaleString()
              : '-'}{' '}
            <FlowIcon width={18} height={22} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractInfo;
