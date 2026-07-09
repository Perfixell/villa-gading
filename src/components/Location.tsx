import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Location() {
  const ref = useScrollAnimation();

  return (
    <section id="location" className="py-24 md:py-32 bg-sand-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label animate-on-scroll mb-4">Find Us</p>
          <h2 className="section-title animate-on-scroll delay-100 mb-6">Our Location</h2>
          <p className="section-subtitle animate-on-scroll delay-200">
            Nestled in the heart of Mas Village, perfectly positioned between Ubud's cultural wonders and peaceful countryside.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Map */}
          <div className="lg:col-span-3 animate-on-scroll delay-200">
            <div className="rounded-3xl overflow-hidden shadow-luxury-md h-[400px] lg:h-[480px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.8234939786!2d115.26!3d-8.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23f3fda7b7f2f%3A0x0!2sJl.%20Cempaka%2C%20Mas%2C%20Gianyar%2C%20Bali!5e0!3m2!1sen!2sid!4v1699999999999!5m2!1sen!2sid&q=Jalan+Cempaka+Mas+Gianyar+Bali"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Villa Gading Location Map"
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-2 flex flex-col gap-5 animate-on-scroll delay-300">
            {/* Address */}
            <div className="bg-white rounded-2xl p-6 shadow-luxury flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-sand-200 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-gold-300" />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold text-charcoal-100 tracking-wide uppercase mb-1">Address</p>
                <p className="font-sans text-sm text-charcoal-300 leading-relaxed">
                  Jalan Cempaka, Mas, Gianyar<br />
                  Bali 80571, Indonesia
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-2xl p-6 shadow-luxury flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-sand-200 flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-gold-300" />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold text-charcoal-100 tracking-wide uppercase mb-1">Phone</p>
                <a
                  href="tel:+6208993176567"
                  className="font-sans text-sm text-charcoal-300 hover:text-gold-300 transition-colors"
                >
                  0899-3176-567
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-luxury flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-sand-200 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-gold-300" />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold text-charcoal-100 tracking-wide uppercase mb-1">Hours</p>
                <p className="font-sans text-sm text-charcoal-300">Open 24 Hours</p>
                <p className="font-sans text-xs text-charcoal-100 mt-0.5">Check-in from 2:00 PM</p>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="https://maps.google.com/?q=Jalan+Cempaka,+Mas,+Gianyar,+Bali+80571"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-sm gap-2"
            >
              <MapPin size={16} />
              Open in Google Maps
              <ExternalLink size={14} />
            </a>

            {/* Both villas note */}
            <div className="bg-sage-100/50 rounded-2xl p-5 border border-sage-200">
              <p className="font-sans text-xs font-semibold text-sage-500 tracking-wide uppercase mb-2">Both Villas</p>
              <p className="font-sans text-xs text-charcoal-200 leading-relaxed">
                Villa Gading and Villa Gading 2 are located in the same peaceful neighborhood, making it easy for groups to stay together in adjacent properties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
