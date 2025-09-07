import { useFlowCurrentUser } from '@onflow/react-sdk';
import AppRouter from './AppRouter'
import Header from '../component/Header';
import Landing from '../pages/landing';

const Layout = () => {
  const { user } = useFlowCurrentUser();
  const loggedIn = user?.loggedIn;

  return (
    <div className="min-h-screen bg-gray-50 font-mono text-sm leading-relaxed">
      <Header />
      <main>{loggedIn ? <AppRouter /> : <Landing />}</main>
    </div>
  );
};

export default Layout