import { BrowserRouter } from 'react-router-dom';
import AppProvider from './providers/AppProvider';
import Layout from './router/layout';

const App = () => (
  <AppProvider>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </AppProvider>
);

export default App;
