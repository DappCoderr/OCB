// import ContractInfo from './ContractInfo';
// import StakingInfo from './StakingInfo';

// const Sidebar = ({ flowBalance, contractBalance }) => {
//   return (
//     <div className="space-y-6">
//       <ContractInfo contractBalance={contractBalance} flowBalance={flowBalance} />
//       <StakingInfo />
//     </div>
//   );
// };

// export default Sidebar;

import ContractInfo from './ContractInfo';
import StakingInfo from './StakingInfo';

const Sidebar = ({ flowBalance, contractBalance }) => {
  return (
    <div className="space-y-6">
      <ContractInfo
        contractBalance={contractBalance}
        flowBalance={flowBalance}
      />
      <StakingInfo />
    </div>
  );
};

export default Sidebar;
