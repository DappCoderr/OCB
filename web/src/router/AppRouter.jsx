import { Routes, Route } from 'react-router-dom';
import Mint from '../pages/mint';
import FAQ from '../component/FAQ';
import History from '../pages/history';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Mint />} />
    <Route path="/history" element={<History />} />
    <Route path="/faq" element={<FAQ />} />
  </Routes>
);

export default AppRouter;
