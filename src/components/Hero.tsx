import { ChevronDown } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

interface HeroProps {
  onBook: () => void;
}

export default function Hero({ onBook }: HeroProps) {
  const scrollToAbout = () => {
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVillas = () => {
    const el = document.querySelector('#villas');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={`${BASE}images/reviews/471909490.jpg`}
          alt="Villa Gading private pool at dusk"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-400/60 via-charcoal-400/40 to-charcoal-400/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div
          className="inline-block mb-6"
          style={{ animation: 'fadeIn 1s ease-out 0.2s both' }}
        >
          <span className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-gold-200 border border-gold-200/40 px-4 py-1.5 rounded-full backdrop-blur-sm bg-white/5">
            Ubud, Bali, Indonesia
          </span>
        </div>

        <h1
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-tight text-shadow-lg mb-6"
          style={{ animation: 'fadeUp 0.9s ease-out 0.4s both' }}
        >
          Experience Your<br />
          <em className="font-light text-sand-200">Private Escape</em><br />
          in the Heart of Ubud
        </h1>

        <p
          className="font-sans text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-10 font-light"
          style={{ animation: 'fadeUp 0.9s ease-out 0.6s both' }}
        >
          Discover two beautifully designed private villas where tranquil surroundings,
          thoughtful comfort, and authentic Balinese hospitality come together to create
          an unforgettable stay.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{ animation: 'fadeUp 0.9s ease-out 0.8s both' }}
        >
<button
  onClick={onBook}
  className="btn-gold text-sm px-10 py-4"
>
  Book Your Stay
</button>
          <button
            onClick={scrollToVillas}
            className="btn-outline text-sm px-10 py-4"
          >
            Explore Our Villas
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors duration-300 flex flex-col items-center gap-2"
        aria-label="Scroll down"
        style={{ animation: 'fadeIn 1s ease-out 1.2s both' }}
      >
        <span className="font-sans text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} className="animate-bounce" />
      </button>

      {/* Bottom gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-100 to-transparent" />
    </section>
  );
}
