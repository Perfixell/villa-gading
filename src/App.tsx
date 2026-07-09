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

export default function App() {
  return (
    <div className="min-h-screen bg-cream-100 font-sans">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Villas />
        <Gallery />
        <WhyChoose />
        <Reviews />
        <Location />
        <BookingCTA />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
