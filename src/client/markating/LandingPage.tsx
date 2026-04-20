'use client';
import FeaturesSection from './FeaturesSection';
import Footer from './Footer';
import DemoVideoSection from './DemoVideoSection';
import Faq from './Faq';
import CTASection from './CTASection';
import Navbar from './Navbar';
import Hero from './Hero';

import CanvasShowcase from '@/client/markating/CanvasShowcase';

export default function LandingPage() {
  return (
    <div className="relative flex flex-col bg-black text-white">
      <Navbar />
      <Hero />
      <DemoVideoSection />

      <FeaturesSection />
      <CanvasShowcase />
      <Faq />
      <CTASection />

      <Footer />
    </div>
  );
}
