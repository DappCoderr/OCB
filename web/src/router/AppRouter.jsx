import { Routes, Route } from 'react-router-dom';
import Mint from '../pages/mint';
import FAQ from '../pages/FAQ';
import Lottery from '../pages/lottery';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Mint />} />
    <Route path="/lottery" element={<Lottery />} />
    <Route path="/faq" element={<FAQ />} />
  </Routes>
);

export default AppRouter;
