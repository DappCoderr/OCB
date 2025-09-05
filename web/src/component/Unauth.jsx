import { useCurrentFlowUser } from '@onflow/kit';

const Unauth = () => {
  const { signIn } = useCurrentFlowUser();

  return (
    <button
      onClick={signIn}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
    >
      Connect Wallet
    </button>
  );
};

export default Unauth;
