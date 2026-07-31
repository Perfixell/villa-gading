const termsSections = [
  {
    title: "1. Overview & Acceptance of Terms",
    items: [
      "By accessing this website, booking a stay, or checking into the property, you confirm that you are at least 18 years of age and agree to these Terms & Conditions without limitation or qualification.",
      "If you do not agree, you must refrain from booking or using our services.",
    ],
  },
  {
    title: "2. Bookings & Occupancy Limits",
    items: [
      "A reservation is officially confirmed only upon receipt of 100% full payment and issuance of a written booking confirmation.",
      "The villa strictly accommodates a maximum of 6 adults. Exceeding this guest limit without prior written approval is prohibited and may result in immediate cancellation of your stay without a refund.",
      "Guests must provide accurate contact details when completing a reservation.",
    ],
  },
  {
    title: "3. Payment & Currency",
    items: [
      "All rates and charges are quoted and processed in Indonesian Rupiah (IDR).",
      "Full payment (100% of the total reservation fee) is required upfront at the time of booking to secure your reservation.",
      "We reserve the right to correct pricing errors on our platform.",
    ],
  },
  {
    title: "4. Cancellation & Refund Policy",
    items: [
      "You are eligible for a 100% full refund if you cancel your reservation at least 1 day (24 hours) prior to the standard check-in time on your arrival date.",
      "Cancellations made less than 24 hours prior to check-in, or failure to arrive on the check-in date (no-show), are strictly non-refundable.",
      "No refunds or credits will be provided for early departures or unused nights.",
    ],
  },
  {
    title: "5. Check-In & Check-Out",
    items: [
      "Standard check-in time is 2:00 PM WITA.",
      "Standard check-out time is 11:00 AM WITA.",
      "Valid photo identification (Passport or KTP) must be presented upon check-in.",
      "Late check-out requests are subject to availability and may incur additional charges.",
    ],
  },
  {
    title: "6. House Rules",
    items: [
      "No smoking inside the villa and enclosed indoor spaces.",
      "No pets are allowed on the premises.",
      "No parties, gatherings, or commercial events are permitted.",
      "Quiet hours apply between 10:00 PM and 7:00 AM.",
    ],
  },
  {
    title: "7. Damages & Guest Responsibility",
    items: [
      "Guests are responsible for any damage to the villa structure, furniture, amenities, or missing inventory caused during their stay.",
      "Any costs associated with repairing damage or replacing missing or broken items will be invoiced directly to the lead guest and must be settled prior to departure.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    items: [
      "Villa Gading is not responsible for the loss, theft, or damage of guests' personal belongings, money, or valuables.",
      "Guests use all villa amenities at their own risk.",
      "Villa Gading shall not be held liable for failure or delay caused by events beyond reasonable control.",
    ],
  },
  {
    title: "9. Website & Intellectual Property",
    items: [
      "All content on the Villa Gading website is owned by Villa Gading and protected by applicable copyright laws in Indonesia.",
      "Content may not be reproduced, modified, or republished without prior written authorization.",
    ],
  },
  {
    title: "10. Privacy Policy",
    items: [
      "Personal data provided during the booking process will be used solely for managing your reservation, processing payments, and contacting you regarding your stay.",
      "Your personal information will never be sold or shared with external third parties, except as required by law.",
    ],
  },
  {
    title: "11. Applicable Law",
    items: [
      "These Terms & Conditions are governed by the laws of the Republic of Indonesia.",
      "Any legal disputes shall be subject to the jurisdiction of the local courts in Gianyar, Bali, Indonesia.",
    ],
  },
  {
    title: "12. Contact Us",
    items: [
      "Property Name: Villa Gading",
      "Email: villagading27@gmail.com",
      "Address: Jalan Cempaka 100xx Mas, Ubud, Jl. Cempaka, Mas, Gianyar, Kab. Gianyar, Bali 80571, Indonesia",
    ],
  },
];

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="section-label">Legal</p>
            <h2 id="terms-modal-title" className="section-title mt-2">
              Terms & Conditions
            </h2>
            <p className="section-subtitle mt-3 max-w-3xl">
              Please read these booking terms carefully before confirming a reservation at Villa Gading.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm text-charcoal-200 transition hover:bg-gray-50"
            aria-label="Close terms"
          >
            Close
          </button>
        </div>

        <div className="space-y-8 rounded-3xl border border-gray-200 bg-cream-100 p-5 sm:p-8">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-charcoal-200">Last Updated: July 29, 2026</p>
            <p className="mt-3 text-sm leading-7 text-charcoal-200">
              Welcome to Villa Gading. These Terms & Conditions govern your use of our website and all reservation agreements made with Villa Gading. By making a booking or staying at our villa, you agree to comply with and be bound by the terms below.
            </p>
          </div>

          {termsSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="font-serif text-2xl text-charcoal-300">{section.title}</h3>
              <ul className="space-y-3 text-sm leading-7 text-charcoal-200">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 flex-none rounded-full bg-gold-300" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
