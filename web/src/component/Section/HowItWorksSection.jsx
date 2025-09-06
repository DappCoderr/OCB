const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started with OCB is simple and straightforward.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Mint Your Bag
            </h3>
            <p className="text-gray-600">Acquire an OCB NFT to get started.</p>
          </div>

          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Auto-Staking
            </h3>
            <p className="text-gray-600">
              Minting amount is automatically staked into Flow Node.
            </p>
          </div>

          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Earn & Win
            </h3>
            <p className="text-gray-600">
              One Holder will get the change to win the staking reward
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
