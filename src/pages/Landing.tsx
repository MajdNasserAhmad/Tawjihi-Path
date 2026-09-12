import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { WhyTawjihi } from '../components/landing/WhyTawjihi';
import { Services } from '../components/landing/Services';
import { StatsMockup } from '../components/landing/StatsMockup';
import { Testimonials } from '../components/landing/Testimonials';
import { FAQ } from '../components/landing/FAQ';
import { BottomCTA } from '../components/landing/BottomCTA';
import { Footer } from '../components/landing/Footer';

export function Landing() {
  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden font-cairo">
      <Navbar />
      <Hero />
      <HowItWorks />
      <WhyTawjihi />
      <Services />
      <StatsMockup />
      <Testimonials />
      <FAQ />
      <BottomCTA />
      <Footer />
    </div>
  );
}

export default Landing;
