'use client';
import EventsSection from './EventsSection';
import Footer from './Footer';
import ComplexitySection from './ComplexitySection';
import Faq from './Faq';
import Getstart from './Getstart';
import Navbar from './Navbar';
import Hero from './Hero';
import CaseStudy from '@/client/markating/CaseStudy';

export default function LandingPage() {
  return (
    <div className="relative flex flex-col bg-black text-white">
      <Navbar />
      <Hero />
      <ComplexitySection />
      <EventsSection />

      <Faq />
      <Getstart />

      <Footer />
    </div>
  );
}
