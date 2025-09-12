import { useAuth } from '../context/AuthContext';

const Unauth = () => {
  const { authenticate } = useAuth();

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