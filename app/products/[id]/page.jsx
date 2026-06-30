"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id;
  const [vehicle, setVehicle] = useState(null);
  const [isVehicleLoading, setIsVehicleLoading] = useState(true);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        if (!response.ok) {
          router.push("/");
          return;
        }
        setIsAuthenticated(true);
      } catch {
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const loadVehicle = async () => {
      setIsVehicleLoading(true);
      try {
        const response = await fetch(`/api/content/vehicle/${productId}`, {
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setVehicle(data.vehicle || null);
        } else {
          setVehicle(null);
        }
      } catch {
        setVehicle(null);
      } finally {
        setIsVehicleLoading(false);
      }
    };

    if (productId) {
      loadVehicle();
    }
  }, [productId]);

  if (isVehicleLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#111827_0%,#06070b_45%,#020304_100%)] text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-zinc-300">Loading vehicle...</p>
        </div>
      </div>
    );
  }

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

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#111827_0%,#06070b_45%,#020304_100%)] text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-zinc-300">Verifying access...</p>
        </div>
      </div>
    );
  }

  const vehicleImages = Array.isArray(vehicle.images) && vehicle.images.length > 0
    ? vehicle.images
    : vehicle.image
    ? [vehicle.image]
    : [];

  const nextImage = () => {
    if (vehicleImages.length === 0) {
      return;
    }

    setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
  };

  const prevImage = () => {
    if (vehicleImages.length === 0) {
      return;
    }

    setCurrentImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length);
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
                {vehicleImages.length > 0 ? (
                  <img
                    src={vehicleImages[currentImageIndex]}
                    alt={`${vehicle.name} - View ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center text-zinc-400">
                    No gallery image available
                  </div>
                )}
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
              {vehicleImages.length > 0 && (
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {currentImageIndex + 1} / {vehicleImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-5 gap-3 mt-6">
              {vehicleImages.map((image, index) => (
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
              {vehicleImages.length === 0 && (
                <p className="col-span-5 rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                  No gallery photos available for this vehicle.
                </p>
              )}
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