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
              OWN & WIN
            </span>
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            The 1st yield-bearing NFT on Flow. NFTs shouldn't just sit in a
            wallet —{' '}
            <span className="font-semibold text-green-600">
              they should work for you
            </span>
            . With OCB, every mint price is{' '}
            <span className="font-semibold text-green-600">
              staked into Flow nodes
            </span>
            , generating real yield and fueling a weekly{' '}
            <span className="font-semibold text-green-600">REWARD 🎉</span> for
            one lucky holder.
          </p>
        </div>

        <div className="md:w-1/2">
          <WeeklyReward />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
