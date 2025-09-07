import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { FlowProvider } from '@onflow/react-sdk';
import { flowJSON } from '../flow';
import { fclConfig } from '../config';

const AppProvider = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <FlowProvider config={fclConfig} flowJson={flowJSON} darkMode={false}>
        {children}
      </FlowProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
