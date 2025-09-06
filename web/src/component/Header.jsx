import { Link } from 'react-router-dom';
import Auth from './Auth';
import Unauth from './Unauth';
import { useFlowCurrentUser } from '@onflow/react-sdk';

const Header = () => {
  const { user } = useFlowCurrentUser();

  return (
    <header className="flex items-center justify-between p-6 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="text-lg font-bold hover:text-gray-600 transition-colors"
        >
          OCB 0.1
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {user?.loggedIn ? <Auth /> : <Unauth />}
      </div>
    </header>
  );
};

export default Header;
