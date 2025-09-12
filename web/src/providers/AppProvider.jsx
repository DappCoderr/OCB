import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext.jsx';
import '../config';

const AppProvider = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;