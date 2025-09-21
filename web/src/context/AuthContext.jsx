import { useState, useEffect, createContext, useContext } from 'react';
import * as fcl from '@onflow/fcl';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  // REMOVED: local account state, isLoading, error
  const queryClient = useQueryClient();

  useEffect(() => fcl.currentUser().subscribe(setUser), []);

  // React Query manages the account data, caching, loading, and errors
  const {
    data: account,
    isLoading: isAccountLoading,
    error: accountError,
    refetch: refetchAccount,
  } = useQuery({
    queryKey: ['account', user?.addr],
    queryFn: async () => {
      if (!user?.addr) return null;
      return await fcl.account(user.addr);
    },
    enabled: !!user?.addr, // Only run if user.addr exists
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const authenticate = async () => {
    try {
      await fcl.authenticate();
      queryClient.invalidateQueries({ queryKey: ['account'] });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const unauthenticate = async () => {
    try {
      await fcl.unauthenticate();
      queryClient.removeQueries({ queryKey: ['account'] });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  };

  const value = {
    user,
    account,
    isLoading: isAccountLoading,
    error: accountError,
    authenticate,
    unauthenticate,
    refetchAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
