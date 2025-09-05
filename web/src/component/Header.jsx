import { Link } from 'react-router-dom';
import { useCurrentFlowUser } from '@onflow/kit';
import Auth from './Auth';
import Unauth from './Unauth';

const Header = () => {
  const { user } = useCurrentFlowUser();

  return (
    <header className="flex items-center justify-between p-6 border-b border-gray-200">
      {/* Left side: Logo + Mint + Contract */}
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="text-lg font-bold hover:text-gray-600 transition-colors"
        >
          OCB 0.1
        </Link>
        <Link
          to="/mint"
          className="px-3 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          ★ Mint Now
        </Link>
      </div>

      {/* Right side: Navigation + Wallet */}
      <div className="flex items-center space-x-4">
        <nav className="flex space-x-4 mr-4">
          <Link
            to="/faq"
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            FAQ
          </Link>
        </nav>
        {user ? <Auth /> : <Unauth />}
      </div>
    </header>
  );
};

export default Header;
