import { Routes, Route } from 'react-router-dom';
import Mint from '../component/Mint';
import FAQ from '../component/FAQ';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Mint />} />
    <Route path="/faq" element={<FAQ />} />
  </Routes>
);

export default AppRouter;
