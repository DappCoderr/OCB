import ContractInfo from "./ContractInfo";
import StakingInfo from "./StakingInfo";

const Sidebar = ({ contractBalance }) => {
  return (
    <div>
      <div className="w-full lg:w-72 flex-shrink-0">
        <ContractInfo contractBalance={contractBalance} />
        <StakingInfo />
      </div>
    </div>
  );
};

export default Sidebar;
