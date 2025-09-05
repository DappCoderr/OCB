import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './component/Home';
import Mint from './component/Mint';
import FAQ from './component/FAQ';
import ErrorBoundary from './component/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/mint',
        element: <Mint />,
      },
      {
        path: '/faq',
        element: <FAQ />,
      },
    ],
  },
]);

export default router;
