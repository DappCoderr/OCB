import { useFlowCurrentUser } from '@onflow/react-sdk';

const Unauth = () => {
  const { authenticate } = useFlowCurrentUser();

  return (
    <button
      onClick={authenticate}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
    >
      Connect Wallet
    </button>
  );
};

export default Unauth;
