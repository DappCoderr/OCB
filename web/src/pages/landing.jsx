import HeroSection from '../component/Section/HeroSection';
import FAQSection from '../component/Section/FAQSection';
import BenefitsSection from '../component/Section/BenefitsSection';
import HowItWorksSection from '../component/section/HowItWorksSection';

const Landing = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <FAQSection />
    </main>
  );
};

export default Landing;
