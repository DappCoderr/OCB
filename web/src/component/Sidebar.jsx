import ContractInfo from './ContractInfo';
import StakingInfo from './StakingInfo';

const Sidebar = ({contractBalance }) => {
  return (
    <div className="space-y-6">
      <ContractInfo
        contractBalance={contractBalance}
      />
      <StakingInfo />
    </div>
  );
};

export default Sidebar;
