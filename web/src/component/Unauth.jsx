import { useAuth } from '../context/AuthContext';

const Unauth = () => {
  const { authenticate } = useAuth();

  return (
    <button
      className="flex items-center space-x-2 bg-black hover:bg-gray-600 text-white px-5 py-2 rounded-xl font-medium transition-colors shadow-md"
      onClick={authenticate}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m4-3h-7m0 0l3-3m-3 3l3 3"
        />
      </svg>
      <span>Connect Wallet</span>
    </button>
  );
};

export default Unauth;
