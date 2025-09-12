const AdditionalInfo = () => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
      <h3 className="font-semibold mb-2 text-sm">Minting Details:</h3>
      <ul className="text-xs text-gray-600 space-y-1">
        <li>• Maximum 20 NFTs per Account</li>
        <li>• View your NFT instantly on FlowView after minting</li>
        <li>• Rewards are distributed weekly</li>
        <li>• 15% of rewards are restaked for compounding</li>
        <li>• 5% platform fee applies to rewards</li>
        <li>• 100 NFTs are reserved for the team</li>
        <li>• Zero-gas fees</li>
      </ul>
    </div>
  );
};

export default AdditionalInfo;
