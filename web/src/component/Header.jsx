import { Link } from 'react-router-dom';
import Auth from './Auth';
import Unauth from './Unauth';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between p-6 border-b border-gray-200">
      {/* Left side: Logo + Links */}
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-bold hover:text-gray-600 transition-colors"
        >
          OCB 0.1
        </Link>

        {/* Show these links only if logged in */}
        {user?.loggedIn && (
          <>
            <Link
              to="/history"
              className="hover:text-gray-600 transition-colors"
            >
              History
            </Link>
            <Link
              to="/faq"
              className="hover:text-gray-600 transition-colors"
            >
              FAQ
            </Link>
          </>
        )}
      </div>

      {/* Right side: Auth / Unauth */}
      <div className="flex items-center space-x-4">
        {user?.loggedIn ? <Auth /> : <Unauth />}
      </div>
    </header>
  );
};

export default Header;
