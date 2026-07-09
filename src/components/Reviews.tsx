import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const reviews = [
  {
    name: 'Fion Kee',
    country: 'Malaysia',
    score: 9.2,
    text: 'The staff were incredibly friendly and punctual, even arranging airport pickup. The villa offered beautiful bathrooms with a bathtub, comfortable beds, a lovely swimming pool, and thoughtful amenities like a hot-and-cold water dispenser. The peaceful surroundings, nearby minimart, cafés, and restaurants made our stay even more enjoyable.',
    initials: 'FK',
    color: 'bg-sage-300',
  },
  {
    name: 'Dino Tiric',
    country: 'Bosnia',
    score: 10,
    text: 'One of the best villa experiences in Ubud. Exceptional service from Eko and the entire team. Friendly, welcoming, and perfect for families with children.',
    initials: 'DT',
    color: 'bg-gold-300',
  },
  {
    name: 'Shannon',
    country: 'Ireland',
    score: 9.0,
    text: 'This villa is beautiful and comfortable. Staff were amazing! Kadek was very helpful in providing ideas for things to do in Ubud and gave us the best recommendations. He also drove us to our destinations during our stay and waited for us! Transport to and from the airport also provided all at a good price. The villa is located around 15–20 minutes walk into Ubud. There are plenty of cafes and restaurants only a few minutes walk and a 24hr Circle K right next door. The pool was a great touch and really lights up the villa at night. We only wish we had stayed longer and spent a few days relaxing by the pool. We had 3 couples staying in the villa and we all loved it!',
    initials: 'SH',
    color: 'bg-charcoal-200',
  },
  {
    name: 'Tracy',
    country: 'Australia',
    score: 10,
    text: 'Very relaxing villa, beautiful pool. Very attentive hosts. Will be back again. Rosita and her brother were fantastic and caring hosts. Loved the closeness of restaurants and the spa right next door — our favourite breakfast was at the end of the lane, a vegetarian place called "Samyama". The other great eating place "Surya Kembar" Villas restaurant was set in a rice field — turn right as you enter the street, about 75 metres down to the right, down several stairs in the grounds of the retreat.',
    initials: 'TR',
    color: 'bg-sand-300',
  },
];

function StarRating({ score }: { score: number }) {
  const full = Math.floor(score / 2);
  const half = (score / 2) % 1 >= 0.5;
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`text-sm ${i < full ? 'text-gold-300' : i === full && half ? 'text-gold-200' : 'text-sand-300'}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useScrollAnimation();

  const go = useCallback((dir: 1 | -1) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent((c) => (c + dir + reviews.length) % reviews.length);
      setIsAnimating(false);
    }, 200);
  }, [isAnimating]);

  useEffect(() => {
    const timer = setInterval(() => go(1), 7000);
    return () => clearInterval(timer);
  }, [go]);

  const review = reviews[current];

  return (
    <section id="reviews" className="py-24 md:py-32 bg-sand-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label animate-on-scroll mb-4">Guest Experiences</p>
          <h2 className="section-title animate-on-scroll delay-100 mb-6">What Our Guests Say</h2>

          {/* Overall Rating */}
          <div className="animate-on-scroll delay-200 flex flex-col items-center gap-3">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-6xl font-normal text-charcoal-300">4.4</span>
              <span className="font-sans text-xl text-charcoal-100">/ 5</span>
            </div>
            <div className="flex gap-1">
              {[1,2,3,4].map(i => (
                <span key={i} className="text-gold-300 text-2xl">★</span>
              ))}
              <span className="text-sand-300 text-2xl">★</span>
            </div>
            <p className="font-sans text-sm text-charcoal-100">Based on 21 verified guest reviews</p>
          </div>
        </div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto animate-on-scroll delay-300">
          <div
            className={`bg-white rounded-3xl p-10 md:p-14 shadow-luxury-md transition-opacity duration-200 ${
              isAnimating ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {/* Quote icon */}
            <div className="w-12 h-12 rounded-full bg-sand-200 flex items-center justify-center mb-8">
              <Quote size={20} className="text-gold-300" />
            </div>

            <blockquote className="font-serif text-lg md:text-xl text-charcoal-200 leading-relaxed italic mb-8 font-normal">
              "{review.text}"
            </blockquote>

            {/* Reviewer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${review.color} flex items-center justify-center`}>
                  <span className="font-sans text-sm font-semibold text-white">{review.initials}</span>
                </div>
                <div>
                  <p className="font-sans font-semibold text-charcoal-300 text-sm">{review.name}</p>
                  <p className="font-sans text-xs text-charcoal-100">{review.country}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 mb-1">
                  <StarRating score={review.score} />
                </div>
                <p className="font-sans text-xs text-charcoal-100">Score: {review.score}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={() => go(-1)}
              className="w-11 h-11 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-200 hover:border-gold-300 hover:text-gold-300 transition-all duration-300"
              aria-label="Previous review"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { if (!isAnimating) { setIsAnimating(true); setTimeout(() => { setCurrent(i); setIsAnimating(false); }, 200); } }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-gold-300' : 'w-2 bg-sand-300'
                  }`}
                  aria-label={`Review ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              className="w-11 h-11 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-200 hover:border-gold-300 hover:text-gold-300 transition-all duration-300"
              aria-label="Next review"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
