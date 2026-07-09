import { Leaf, Waves, Heart, MapPin } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const reasons = [
  {
    icon: Leaf,
    title: 'Peaceful Rice Field Setting',
    desc: 'Awaken to the sound of nature. Our villas are embraced by the emerald terraces of Mas Village — a setting that immediately quiets the mind and soothes the soul.',
    delay: 'delay-100',
  },
  {
    icon: Waves,
    title: 'Private Swimming Pools',
    desc: 'Dive into your own slice of paradise. Each villa features a private pool for your exclusive use — beautifully maintained and enchanting at night.',
    delay: 'delay-200',
  },
  {
    icon: Heart,
    title: 'Authentic Balinese Hospitality',
    desc: 'Our team goes beyond the expected. From airport transfers to local recommendations, we are here to make every moment of your stay effortless and memorable.',
    delay: 'delay-300',
  },
  {
    icon: MapPin,
    title: 'Prime Ubud Location',
    desc: 'Temples, art galleries, organic cafés, rice terrace walks, and world-class spas — all within minutes. The best of Ubud is right at your doorstep.',
    delay: 'delay-400',
  },
];

export default function WhyChoose() {
  const ref = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 bg-cream-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label animate-on-scroll mb-4">Our Promise</p>
          <h2 className="section-title animate-on-scroll delay-100 mb-6">
            Why Choose<br />
            <em className="font-light">Villa Gading</em>
          </h2>
          <p className="section-subtitle animate-on-scroll delay-200">
            Four reasons guests return year after year.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map(({ icon: Icon, title, desc, delay }) => (
            <div
              key={title}
              className={`animate-on-scroll ${delay} bg-white rounded-3xl p-8 shadow-luxury hover:shadow-luxury-md hover:-translate-y-1 transition-all duration-500 group`}
            >
              <div className="w-14 h-14 rounded-2xl bg-sand-200 flex items-center justify-center mb-6 group-hover:bg-gold-100 transition-colors duration-300">
                <Icon size={24} className="text-gold-300" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-charcoal-300 mb-3 leading-snug">
                {title}
              </h3>
              <p className="font-sans text-sm text-charcoal-100 leading-relaxed font-light">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
