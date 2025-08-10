import { Outlet } from "react-router-dom";
import Header from "./component/Header";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-mono text-sm leading-relaxed">
      <Header />
      <Outlet />
    </div>
  );
};

export default App;
