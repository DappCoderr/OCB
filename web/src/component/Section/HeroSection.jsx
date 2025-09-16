import WeeklyReward from './WeeklyReward';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleMintClick = () => {
    navigate('/mint');
  };

  return (
    <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pb-24">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
              OWN & WIN.
            </span>
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            NFT shouldn't just sit in a wallet —{' '}
            <span className="font-semibold text-green-600">
              it should work for you.{' '}
            </span>
            With OCB, every mint price is{' '}
            <span className="font-semibold text-green-600">
              staked into Flow nodes
            </span>
            , generating real yield & fueling a weekly massive{' '}
            <span className="font-semibold text-green-600">REWARD 🎉</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button
              onClick={handleMintClick}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Mint Your Bag Now
            </button>
          </div>
        </div>

        <div className="md:w-1/2">
          <WeeklyReward />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
