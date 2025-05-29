import React from "react";

function Header({
  walletConnected,
  connectWallet,
  currentPage,
  setCurrentPage,
}) {
  const navItems = [{ id: "faq", label: "FAQ" }];

  const renderNavItem = (item) => (
    <button
      key={item.id}
      onClick={() => setCurrentPage(item.id)}
      className={`text-sm transition-colors ${
        currentPage === item.id
          ? "text-black font-medium"
          : "text-gray-600 hover:text-black"
      }`}
    >
      {item.label}
    </button>
  );

  return (
    <header className="flex items-center justify-between p-6 border-b border-gray-200">
      {/* Left side: Logo + Mint + Contract */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCurrentPage("home")}
          className="text-lg font-bold hover:text-gray-600 transition-colors"
          aria-label="Go to home"
        >
          ocb 0.1
        </button>
        <button
          onClick={() => setCurrentPage("mint")}
          className="px-3 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 transition-colors"
          aria-label="Mint your NFT"
        >
          ★ Mint Now
        </button>
      </div>

      {/* Right side: Navigation + Wallet */}
      <div className="flex items-center space-x-4">
        <nav className="flex space-x-4 mr-4" aria-label="Navigation links">
          {navItems.map(renderNavItem)}
        </nav>
        <button
          onClick={connectWallet}
          className={`px-4 py-2 text-xs rounded border transition-colors ${
            walletConnected
              ? "bg-green-100 text-green-800 border-green-300"
              : "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
          }`}
          aria-label="Connect wallet"
        >
          {walletConnected ? "✓ Connected" : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
}

export default Header;
