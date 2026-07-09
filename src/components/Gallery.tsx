import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const BASE = import.meta.env.BASE_URL;

const images = [
  { src: `${BASE}images/reviews/471909490.jpg`, alt: 'Villa Gading private pool at dusk', span: 'lg:col-span-2 lg:row-span-2' },
  { src: `${BASE}images/reviews/849065921.jpg`, alt: 'Villa Gading 2 tropical pool with lush gardens', span: '' },
  { src: `${BASE}images/reviews/849064852.jpg`, alt: 'Luxury bathroom with freestanding bathtub', span: '' },
  { src: `${BASE}images/reviews/471908977.jpg`, alt: 'Spacious bedroom with contemporary Balinese design', span: '' },
  { src: `${BASE}images/reviews/471909276.jpg`, alt: 'Open-plan dining and living area', span: '' },
];

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const ref = useScrollAnimation();

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, []);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, prev, next]);

  return (
    <section id="gallery" className="py-24 md:py-32 bg-cream-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label animate-on-scroll mb-4">A Visual Journey</p>
          <h2 className="section-title animate-on-scroll delay-100 mb-6">Inside Villa Gading</h2>
          <p className="section-subtitle animate-on-scroll delay-200">
            Every corner thoughtfully designed, every detail intentional — step inside and imagine your stay.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[220px] animate-on-scroll delay-300">
          {images.map((img, index) => (
            <div
              key={img.src}
              className={`relative group cursor-pointer overflow-hidden rounded-2xl shadow-luxury hover:shadow-luxury-md transition-all duration-500 ${img.span}`}
              onClick={() => openLightbox(index)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal-400/0 group-hover:bg-charcoal-400/30 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                  <ZoomIn size={20} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-charcoal-400/95 backdrop-blur-md flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <button
            className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            className="max-w-5xl max-h-[85vh] mx-16 md:mx-24"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              className="w-full h-full object-contain rounded-2xl shadow-luxury-lg"
            />
            <p className="text-center font-sans text-sm text-white/60 mt-4">
              {images[lightboxIndex].alt}
            </p>
          </div>

          <button
            className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === lightboxIndex ? 'bg-white w-6' : 'bg-white/40'
                }`}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
