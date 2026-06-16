"use client";

import { useState } from "react";

const stats = [
  { label: "Vehicles Sold", value: "340+" },
  { label: "Happy Clients", value: "500+" },
  { label: "Years Experience", value: "20" },
  { label: "Satisfaction Rate", value: "99%" },
];

const vehicles = [
  {
    name: "Aether S Coupe",
    category: "Grand Touring",
    price: "$88,900",
    description: "A sculpted performance coupe with adaptive air suspension and a 3.0L twin-turbo engine.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Velvet X SUV",
    category: "Luxury SUV",
    price: "$104,500",
    description: "Ultra-luxury comfort, panoramic lounge cabin, and all-wheel-drive confidence for every route.",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Nova GT R",
    category: "Performance",
    price: "$126,200",
    description: "Track-bred styling, carbon accents, and a thunderous V8 for refined adrenaline.",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
];

const testimonials = [
  {
    name: "Ava Thompson",
    role: "Founder, Northline Studio",
    review:
      "The launch experience felt cinematic from start to finish. Every detail felt curated, premium, and effortless.",
    rating: "★★★★★",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Marcus Lee",
    role: "Private Client",
    review:
      "Fast, polished, and genuinely luxurious. The vehicle presentation and support were exceptional.",
    rating: "★★★★★",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  },
];

export default function HomePage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#111827_0%,#06070b_45%,#020304_100%)] text-zinc-100">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.72),rgba(15,23,42,0.45),rgba(0,0,0,0.82))]" />
        <img
          src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80"
          alt="Luxury sports car"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col px-6 py-6 lg:px-10">
          <header className="flex items-center justify-between rounded-full border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-md">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Veichle</p>
              <h2 className="text-lg font-semibold text-white">Luxury Automotive</h2>
            </div>
            <nav className="hidden gap-6 text-sm text-zinc-200 md:flex">
              <a href="#vehicles" className="hover:text-amber-300">Vehicles</a>
              <a href="#gallery" className="hover:text-amber-300">Gallery</a>
              <a href="#contact" className="hover:text-amber-300">Contact</a>
            </nav>
          </header>

          <div className="mt-16 grid flex-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Premium performance • modern design</p>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                Discover the next era of luxury driving.
              </h1>
              <p className="max-w-xl text-lg text-zinc-200 md:text-xl">
                Explore curated vehicles, immersive visuals, and a premium buying experience designed for modern automotive enthusiasts.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(true)}
                  className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
                >
                  PopUp card 
                </button>
                <a href="#contact" className="rounded-full border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12">Book a Visit</a>
              </div>
            </div>

            <aside className="rounded-3xl border border-white/10 bg-black/45 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Why clients choose us</p>
              <ul className="mt-6 space-y-4 text-sm text-zinc-200">
                <li className="rounded-2xl border border-white/10 bg-white/6 p-4">Tailored vehicle curation with rare finds and premium handover.</li>
                <li className="rounded-2xl border border-white/10 bg-white/6 p-4">Luxury showroom presentation and concierge-level support.</li>
                <li className="rounded-2xl border border-white/10 bg-white/6 p-4">Fast, transparent service from first inquiry to delivery.</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-10 lg:grid-cols-4 lg:px-10">
        {stats.map((item) => (
          <article key={item.label} className="rounded-3xl border border-white/10 bg-white/6 p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
            <p className="text-3xl font-black text-white">{item.value}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-zinc-300">{item.label}</p>
          </article>
        ))}
      </section>

      <section id="vehicles" className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Featured vehicles</p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">Curated for power, comfort, and presence.</h2>
          </div>
          <a href="#contact" className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:border-amber-300 hover:text-amber-200 md:block">Request a private viewing</a>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <article key={vehicle.name} className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/90 shadow-2xl shadow-black/30">
              <img src={vehicle.image} alt={vehicle.name} className="h-52 w-full object-cover" />
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-amber-300">{vehicle.category}</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{vehicle.name}</h3>
                  </div>
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm text-amber-200">{vehicle.price}</span>
                </div>
                <p className="text-sm text-zinc-300">{vehicle.description}</p>
                <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300">View Details</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="gallery" className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Gallery</p>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">A glimpse into the showroom experience.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {gallery.map((image, index) => (
            <article key={index} className="overflow-hidden rounded-3xl border border-white/10 bg-white/6 shadow-xl shadow-black/20">
              <img src={image} alt={`Gallery image ${index + 1}`} className="h-56 w-full object-cover transition duration-500 hover:scale-105" />
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Testimonials</p>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">What our clients say.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-3xl border border-white/10 bg-white/6 p-6 shadow-xl shadow-black/25 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  <p className="text-sm text-zinc-300">{item.role}</p>
                </div>
              </div>
              <p className="mt-4 text-zinc-200">“{item.review}”</p>
              <p className="mt-3 text-amber-300">{item.rating}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-7xl px-6 pb-16 pt-6 lg:px-10">
        <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Contact</p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">Visit our showroom or start your private consultation.</h2>
            <p className="mt-4 max-w-xl text-zinc-200">Reach out for pricing, availability, and curated recommendations tailored to your driving style.</p>
            <ul className="mt-6 space-y-3 text-zinc-200">
              <li>📍 18 Aurora Avenue, Downtown District</li>
              <li>📞 +1 (555) 238-9010</li>
              <li>✉️ hello@veichle.example</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/35 p-5 text-sm text-zinc-200">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Showroom map</p>
            <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5242.343250606512!2d91.81174310940852!3d26.132946477025083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b288bd1435301fb%3A0x655c14cb620743d1!2sRudhco%20Infra%20%26%20Tech%20Pvt%20Ltd!5e1!3m2!1sen!2sin!4v1781247075080!5m2!1sen!2sin"
                width="100%"
                height="240"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Showroom location map"
              />
            </div>
          </div>
        </div>
      </section>

      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 text-center shadow-2xl shadow-black/50">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Thank you</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Thanks for contacting us.</h3>
            <p className="mt-3 text-zinc-200">Message received! Our team is reviewing your inquiry and will be in touch within 24 hours.</p>
            <button
              type="button"
              onClick={() => setIsPopupOpen(false)}
              className="mt-6 rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="border-t border-white/10 bg-black/30 py-6 text-center text-sm text-zinc-300">© {new Date().getFullYear()} Veichle. Premium automotive experiences.</footer>
    </main>
  );
}
