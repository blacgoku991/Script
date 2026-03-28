import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Packages from '@/components/landing/Packages';
import PreviewSection from '@/components/landing/PreviewSection';
import UseCases from '@/components/landing/UseCases';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main className="flex flex-col bg-black overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Packages />
      <PreviewSection />
      <UseCases />
      <WhyChooseUs />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
