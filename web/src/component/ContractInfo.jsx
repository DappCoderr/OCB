const ContractInfo = ({ contractBalance }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="font-semibold text-base mb-2 text-gray-700 tracking-wide">
        Contract Balance
      </h3>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800 mb-1">
          {contractBalance !== null
            ? Math.floor(contractBalance).toLocaleString()
            : "-"}
        </div>
        <div className="text-gray-500 text-xs">FLOW</div>
      </div>
    </div>
  );
};

export default ContractInfo;
