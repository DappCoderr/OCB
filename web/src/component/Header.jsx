import { Link } from 'react-router-dom';
import Auth from './Auth';
import Unauth from './Unauth';
import { useAuth } from '../context/AuthContext';
import Bag from '../assets/logo.svg';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between bg-[#12141D] rounded-2xl px-6 py-2 shadow-lg border border-[#2A2D3A]">
          {/* Left side: Logo + Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-3">
              <img src={Bag} alt="Bag Logo" className="h-14 w-14" />
            </Link>

            {/* Keep navigation links in header */}
            {user?.loggedIn && (
              <div className="flex space-x-6 ml-4">
                <Link to="/lottery" className="text-white transition-colors">
                  Lottery
                </Link>
                <Link to="/faq" className="text-white transition-colors">
                  FAQ
                </Link>
              </div>
            )}
          </div>

          {/* Right side: Auth */}
          <div>{user?.loggedIn ? <Auth /> : <Unauth />}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
