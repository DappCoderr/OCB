import AppRouter from './AppRouter';
import Header from '../component/Header';
import Landing from '../pages/landing';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 font-mono text-sm leading-relaxed">
      <Header />
      <main>{user?.loggedIn ? <AppRouter /> : <Landing />}</main>
    </div>
  );
};

export default Layout;