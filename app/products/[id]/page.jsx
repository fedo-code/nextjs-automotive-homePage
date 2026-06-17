"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const vehiclesData = {
  "aether-s-coupe": {
    id: "aether-s-coupe",
    name: "Aether S Coupe",
    category: "Grand Touring",
    price: "$88,900",
    description: "A sculpted performance coupe with adaptive air suspension and a 3.0L twin-turbo engine.",
    fullDescription: "Experience the pinnacle of grand touring excellence with the Aether S Coupe. Featuring a meticulously crafted exterior, this coupe combines aggressive styling with refined elegance. The adaptive air suspension automatically adjusts to road conditions, while the 3.0L twin-turbo engine delivers exhilarating performance with 425 horsepower.",
    specs: {
      engine: "3.0L Twin-Turbo V6",
      horsepower: "425 HP",
      torque: "450 lb-ft",
      topSpeed: "180 mph",
      acceleration: "0-60 mph in 3.8s",
      transmission: "8-Speed Automatic",
      fuelEconomy: "22 city / 28 highway",
      seating: "4 + 1",
      warranty: "5 years / 60,000 miles"
    },
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80",
    ],
    features: [
      "Adaptive Air Suspension",
      "Advanced Traction Control",
      "Premium Leather Interior",
      "Panoramic Sunroof",
      "360-Degree Camera System",
      "Carbon Fiber Accents",
      "Heated Seats",
      "Ambient Lighting"
    ]
  },
  "velvet-x-suv": {
    id: "velvet-x-suv",
    name: "Velvet X SUV",
    category: "Luxury SUV",
    price: "$104,500",
    description: "Ultra-luxury comfort, panoramic lounge cabin, and all-wheel-drive confidence for every route.",
    fullDescription: "Introducing the Velvet X SUV - where opulence meets capability. With its spacious panoramic lounge cabin and cutting-edge all-wheel-drive technology, this SUV redefines luxury travel. Every journey becomes an experience with premium materials and intelligent features designed for discerning drivers.",
    specs: {
      engine: "3.5L Twin-Turbo V8",
      horsepower: "475 HP",
      torque: "510 lb-ft",
      topSpeed: "170 mph",
      acceleration: "0-60 mph in 4.2s",
      transmission: "9-Speed Automatic",
      fuelEconomy: "20 city / 26 highway",
      seating: "7 (with luxury configuration)",
      warranty: "6 years / 75,000 miles"
    },
    images: [
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=900&q=80",
    ],
    features: [
      "Panoramic Lounge Cabin",
      "All-Wheel Drive",
      "Air Suspension System",
      "Premium Audio System",
      "Touchscreen Navigation",
      "Lane Keeping Assist",
      "Adaptive Cruise Control",
      "Heated & Cooled Seats"
    ]
  },
  "nova-gt-r": {
    id: "nova-gt-r",
    name: "Nova GT R",
    category: "Performance",
    price: "$126,200",
    description: "Track-bred styling, carbon accents, and a thunderous V8 for refined adrenaline.",
    fullDescription: "The Nova GT R represents the ultimate expression of performance engineering. With track-inspired aerodynamics, precision-tuned V8 engine, and carbon fiber components, this beast is built for those who demand uncompromising power and agility. Every component is engineered for maximum performance.",
    specs: {
      engine: "5.2L Twin-Turbo V8",
      horsepower: "650 HP",
      torque: "700 lb-ft",
      topSpeed: "200+ mph",
      acceleration: "0-60 mph in 2.9s",
      transmission: "7-Speed Manual/Automatic",
      fuelEconomy: "18 city / 24 highway",
      seating: "2 + 2",
      warranty: "5 years / 60,000 miles"
    },
    images: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80",
    ],
    features: [
      "Carbon Fiber Body Panels",
      "Race-Tuned Suspension",
      "Performance Brake System",
      "Track Mode",
      "Launch Control",
      "Recaro Performance Seats",
      "Roll Cage Integration",
      "Sport Exhaust System"
    ]
  }
};

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id;
  const vehicle = vehiclesData[productId];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#111827_0%,#06070b_45%,#020304_100%)] text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Link href="/" className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-300">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#111827_0%,#06070b_45%,#020304_100%)] text-zinc-100">
      {/* Navigation */}
      <div className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 lg:px-10 flex items-center justify-between">
          <Link href="/" className="text-amber-300 hover:text-amber-200 font-semibold">
            ← Back to Catalog
          </Link>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300">{vehicle.category}</p>
            <h1 className="text-2xl font-bold text-white">{vehicle.name}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-10">
        {/* Image Slider Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Image with Slider */}
          <div className="lg:col-span-2">
            <div className="relative group">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/50 shadow-2xl shadow-black/40">
                <img
                  src={vehicle.images[currentImageIndex]}
                  alt={`${vehicle.name} - View ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover"
                />
              </div>

              {/* Previous Button */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-amber-400 hover:text-black text-white rounded-full p-3 transition duration-300 z-10 opacity-0 group-hover:opacity-100"
              >
                ←
              </button>

              {/* Next Button */}
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-amber-400 hover:text-black text-white rounded-full p-3 transition duration-300 z-10 opacity-0 group-hover:opacity-100"
              >
                →
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold">
                {currentImageIndex + 1} / {vehicle.images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-5 gap-3 mt-6">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative overflow-hidden rounded-lg border-2 transition duration-300 ${
                    index === currentImageIndex
                      ? "border-amber-400 shadow-lg shadow-amber-400/50"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Sliding Text Description */}
            <div className="mt-8 p-6 rounded-3xl border border-white/10 bg-white/6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300 mb-3">
                Image {currentImageIndex + 1} Details
              </p>
              <p className="text-lg text-zinc-200">
                {vehicle.fullDescription}
              </p>
            </div>
          </div>

          {/* Right Sidebar - Price & Quick Info */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="rounded-3xl border border-white/10 bg-white/6 p-8 backdrop-blur-xl text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-300 mb-2">Starting Price</p>
              <p className="text-5xl font-black text-white mb-4">{vehicle.price}</p>
              <button className="w-full bg-amber-400 text-black font-semibold py-3 rounded-full hover:bg-amber-300 transition duration-300">
                Request Quote
              </button>
            </div>

            {/* Quick Specs */}
            <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300 mb-4 font-semibold">Key Specs</p>
              <div className="space-y-3 text-sm text-zinc-200">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Engine:</span>
                  <span className="text-white font-semibold">{vehicle.specs.engine}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Horsepower:</span>
                  <span className="text-white font-semibold">{vehicle.specs.horsepower}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>0-60 MPH:</span>
                  <span className="text-white font-semibold">{vehicle.specs.acceleration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Top Speed:</span>
                  <span className="text-white font-semibold">{vehicle.specs.topSpeed}</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300 mb-4 font-semibold">Contact Us</p>
              <div className="space-y-3 text-sm text-zinc-200">
                <p>📍 18 Aurora Avenue, Downtown District</p>
                <p>📞 +1 (555) 238-9010</p>
                <p>✉️ hello@veichle.example</p>
              </div>
            </div>
          </div>
        </div>

        {/* Full Specifications Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* All Specs */}
          <div className="rounded-3xl border border-white/10 bg-white/6 p-8 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300 mb-6 font-semibold">Complete Specifications</p>
            <div className="space-y-4">
              {Object.entries(vehicle.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-zinc-300 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                  <span className="text-white font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="rounded-3xl border border-white/10 bg-white/6 p-8 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300 mb-6 font-semibold">Premium Features</p>
            <div className="grid grid-cols-1 gap-3">
              {vehicle.features.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedFeatureIndex(index)}
                  className={`p-4 rounded-lg border transition duration-300 cursor-pointer ${
                    index === selectedFeatureIndex
                      ? "border-amber-400 bg-amber-400/10 text-white"
                      : "border-white/10 bg-white/4 text-zinc-300 hover:bg-white/8"
                  }`}
                >
                  <p className="font-semibold">✓ {feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-3xl border border-white/10 bg-white/6 p-12 backdrop-blur-xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Luxury?</h2>
          <p className="text-lg text-zinc-200 mb-8">Schedule a test drive or request more information about the {vehicle.name}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-amber-300 transition duration-300">
              Schedule Test Drive
            </button>
            <button className="border border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:border-amber-400 hover:text-amber-400 transition duration-300">
              Get More Info
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 py-6 text-center text-sm text-zinc-300 mt-16">
        © {new Date().getFullYear()} Veichle. Premium automotive experiences.
      </footer>
    </main>
  );
}