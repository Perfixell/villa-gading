import { Waves, Leaf, MapPin, Users } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const BASE = import.meta.env.BASE_URL;

const features = [
  { icon: Waves, label: 'Private Swimming Pools', desc: 'Beautifully lit pools for your exclusive use' },
  { icon: Leaf, label: 'Rice Field Surroundings', desc: 'Wake up to serene green landscapes' },
  { icon: Users, label: 'Ideal for All Groups', desc: 'Couples, families, and larger gatherings' },
  { icon: MapPin, label: 'Prime Ubud Location', desc: 'Minutes from temples, cafés, and galleries' },
];

export default function About() {
  const ref = useScrollAnimation();

  return (
    <section id="about" className="py-24 md:py-32 bg-cream-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Side */}
          <div>
            <p className="section-label animate-on-scroll mb-4">Our Story</p>
            <h2 className="section-title animate-on-scroll delay-100 mb-6">
              Where Comfort<br />
              <em className="font-light">Meets Nature</em>
            </h2>
            <div className="w-12 h-0.5 bg-gold-300 mb-8 animate-on-scroll delay-200" />
            <p className="section-subtitle animate-on-scroll delay-200 mb-6">
              Nestled in the heart of Mas Village, Ubud, Villa Gading and Villa Gading 2 offer
              an intimate retreat for travelers who seek peace without sacrificing comfort.
              Surrounded by lush rice fields and the gentle rhythms of Balinese life, each villa
              is thoughtfully designed to blend modern amenities with authentic tropical warmth.
            </p>
            <p className="section-subtitle animate-on-scroll delay-300 mb-10">
              Just minutes from Ubud's famous temples, art galleries, organic cafés, and vibrant
              restaurants, these private havens are perfectly positioned for both relaxation and
              exploration. Whether you're here for a romantic escape or a memorable family
              holiday, Villa Gading feels like home — only infinitely more beautiful.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 animate-on-scroll delay-400">
              {features.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-sand-200 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-gold-300" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-charcoal-300 mb-0.5">{label}</p>
                    <p className="font-sans text-xs text-charcoal-100 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images Side */}
          <div className="relative animate-on-scroll delay-200">
            <div className="relative rounded-3xl overflow-hidden shadow-luxury-md aspect-[4/5]">
              <img
                src={`${BASE}images/reviews/471909276.jpg`}
                alt="Villa Gading elegant dining and living area"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-400/20 to-transparent" />
            </div>
            {/* Floating accent card */}
            <div className="absolute -bottom-6 -left-6 bg-cream-100 rounded-2xl shadow-luxury-md p-5 max-w-[200px]">
              <p className="font-serif text-3xl font-semibold text-charcoal-300 leading-none mb-1">4.4</p>
              <div className="flex gap-0.5 mb-1">
                {[1,2,3,4].map(i => (
                  <span key={i} className="text-gold-300 text-sm">★</span>
                ))}
                <span className="text-sand-300 text-sm">★</span>
              </div>
              <p className="font-sans text-xs text-charcoal-100">Average guest rating</p>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-sand-300 opacity-40" />
          </div>
        </div>
      </div>
    </section>
  );
}
