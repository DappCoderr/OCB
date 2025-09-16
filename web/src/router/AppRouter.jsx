import { Routes, Route } from 'react-router-dom';
import Mint from '../pages/mint';
import FAQ from '../pages/FAQ';
import History from '../pages/history';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Mint />} />
    <Route path="/lottery" element={<History />} />
    <Route path="/faq" element={<FAQ />} />
  </Routes>
);

export default AppRouter;
