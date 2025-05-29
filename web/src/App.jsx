import { useState } from "react";
import Header from "./component/Header";
import Home from "./component/Home";
import Mint from "./component/Mint";
import FAQ from "./component/FAQ";

const App = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [totalMinted, setTotalMinted] = useState(2847);
  const [currentPage, setCurrentPage] = useState("home");

  const connectWallet = () => {
    setWalletConnected(!walletConnected);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "mint":
        return (
          <Mint
            walletConnected={walletConnected}
            totalMinted={totalMinted}
            setTotalMinted={setTotalMinted}
          />
        );
      case "faq":
        return <FAQ />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 font-mono text-sm leading-relaxed">
      <Header
        walletConnected={walletConnected}
        connectWallet={connectWallet}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {renderCurrentPage()}
    </div>
  );
};

export default App;
