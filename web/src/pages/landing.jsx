import HeroSection from '../component/section/HeroSection';
import FAQSection from './FAQSection';
import BenefitsSection from '../component/section/BenefitsSection';
import WhoIsOCBFor from '../component/section/WhoIsOCBFor';
import HowItWorksSection from '../component/section/HowItWorksSection';

const Landing = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <HeroSection />
      <BenefitsSection />
      <WhoIsOCBFor />
      <HowItWorksSection />
      <FAQSection />
    </main>
  );
}

export default Landing