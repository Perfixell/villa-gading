import { useEffect, useState } from "react";
import { getVillas } from "./services/villas";
import BookingModal from "./components/BookingModal";


import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Villas from './components/Villas';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import WhyChoose from './components/WhyChoose';
import Location from './components/Location';
import BookingCTA from './components/BookingCTA';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import TermsModal from './components/TermsModal';
import { getPricingPeriods } from "./services/pricing";

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

useEffect(() => {
  async function test() {
    try {
      const villas = await getVillas();
      console.log("Supabase villas:", villas);

      const pricing = await getPricingPeriods(1);
      console.log("Pricing:", pricing);
    } catch (err) {
  console.error("❌ Error:");
  console.error(err);
}
  }

  test();
}, []);

return (
    <div className="min-h-screen bg-cream-100 font-sans">
      <Navigation />
      <main>
        <Hero onBook={() => setIsBookingOpen(true)} />
        <About />
        <Villas />
        <Gallery />
        <WhyChoose />
        <Reviews />
        <Location />
        <BookingCTA />
      </main>

      <Footer onOpenTerms={() => setIsTermsOpen(true)} />
      <BackToTop />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </div>
);
}