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


// import { createContext, useContext, useState, useEffect } from 'react';
// import * as fcl from '@onflow/fcl';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState({ loggedIn: false, addr: null });
//   const [account, setAccount] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Subscribe to user changes
//     fcl.currentUser().subscribe(setUser);
//   }, []);

//   useEffect(() => {
//     // Fetch account data when user changes
//     if (user?.addr) {
//       fetchAccountData();
//     } else {
//       setAccount(null);
//     }
//   }, [user?.addr]);

//   const fetchAccountData = async () => {
//     if (!user?.addr) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const accountData = await fcl.account(user.addr);
//       setAccount(accountData);
//     } catch (err) {
//       setError(err);
//       console.error('Failed to fetch account data:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const authenticate = async () => {
//     try {
//       await fcl.authenticate();
//     } catch (error) {
//       console.error('Failed to connect wallet:', error);
//       throw error;
//     }
//   };

//   const unauthenticate = async () => {
//     try {
//       await fcl.unauthenticate();
//     } catch (error) {
//       console.error('Failed to disconnect wallet:', error);
//       throw error;
//     }
//   };

//   const value = {
//     user,
//     account,
//     isLoading,
//     error,
//     authenticate,
//     unauthenticate,
//     refetchAccount: fetchAccountData,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
