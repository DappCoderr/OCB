import { createContext, useContext, useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: false, addr: null });
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to user changes
    fcl.currentUser().subscribe(setUser);
  }, []);

  useEffect(() => {
    // Fetch account data when user changes
    if (user?.addr) {
      fetchAccountData();
    } else {
      setAccount(null);
    }
  }, [user?.addr]);

  const fetchAccountData = async () => {
    if (!user?.addr) return;

    setIsLoading(true);
    setError(null);

    try {
      const accountData = await fcl.account(user.addr);
      setAccount(accountData);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch account data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async () => {
    try {
      await fcl.authenticate();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const unauthenticate = async () => {
    try {
      await fcl.unauthenticate();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  };

  const value = {
    user,
    account,
    isLoading,
    error,
    authenticate,
    unauthenticate,
    refetchAccount: fetchAccountData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
