"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const stats = [
  { label: "Vehicles Sold", value: "340+" },
  { label: "Happy Clients", value: "500+" },
  { label: "Years Experience", value: "20" },
  { label: "Satisfaction Rate", value: "99%" },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Business Owner",
    review: "The team was transparent, quick, and helped me choose the perfect SUV for my family.",
    rating: "★★★★★",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Ananya Das",
    role: "Software Engineer",
    review: "Premium buying experience from start to finish. Delivery and paperwork were seamless.",
    rating: "★★★★★",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  },
];

const northeastDistricts = {
  Assam: [
    "Bajali",
    "Baksa",
    "Barpeta",
    "Biswanath",
    "Bongaigaon",
    "Cachar",
    "Charaideo",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dhubri",
    "Dibrugarh",
    "Dima Hasao",
    "Goalpara",
    "Golaghat",
    "Hailakandi",
    "Hojai",
    "Jorhat",
    "Kamrup",
    "Kamrup Metropolitan",
    "Karbi Anglong",
    "Karimganj",
    "Kokrajhar",
    "Lakhimpur",
    "Majuli",
    "Morigaon",
    "Nagaon",
    "Nalbari",
    "Sivasagar",
    "Sonitpur",
    "South Salmara-Mankachar",
    "Tamulpur",
    "Tinsukia",
    "Udalguri",
    "West Karbi Anglong",
  ],
  Arunachal_Pradesh: [
    "Anjaw",
    "Bichom",
    "Changlang",
    "Dibang Valley",
    "East Kameng",
    "East Siang",
    "Kamle",
    "Keyi Panyor",
    "Kra Daadi",
    "Kurung Kumey",
    "Lepa Rada",
    "Lohit",
    "Longding",
    "Lower Dibang Valley",
    "Lower Siang",
    "Lower Subansiri",
    "Namsai",
    "Pakke Kessang",
    "Papum Pare",
    "Shi Yomi",
    "Siang",
    "Tawang",
    "Tirap",
    "Upper Siang",
    "Upper Subansiri",
    "West Kameng",
    "West Siang",
  ],
  Manipur: [
    "Bishnupur",
    "Chandel",
    "Churachandpur",
    "Imphal East",
    "Imphal West",
    "Jiribam",
    "Kakching",
    "Kamjong",
    "Kangpokpi",
    "Noney",
    "Pherzawl",
    "Senapati",
    "Tamenglong",
    "Tengnoupal",
    "Thoubal",
    "Ukhrul",
  ],
  Meghalaya: [
    "East Garo Hills",
    "East Jaintia Hills",
    "East Khasi Hills",
    "Eastern West Khasi Hills",
    "North Garo Hills",
    "Ri Bhoi",
    "South Garo Hills",
    "South West Garo Hills",
    "South West Khasi Hills",
    "West Garo Hills",
    "West Jaintia Hills",
    "West Khasi Hills",
  ],
  Mizoram: [
    "Aizawl",
    "Champhai",
    "Hnahthial",
    "Khawzawl",
    "Kolasib",
    "Lawngtlai",
    "Lunglei",
    "Mamit",
    "Saitual",
    "Serchhip",
    "Siaha",
  ],
  Nagaland: [
    "Chumoukedima",
    "Dimapur",
    "Kiphire",
    "Kohima",
    "Longleng",
    "Meluri",
    "Mokokchung",
    "Mon",
    "Niuland",
    "Noklak",
    "Peren",
    "Phek",
    "Shamator",
    "Tseminyu",
    "Tuensang",
    "Wokha",
    "Zunheboto",
  ],
  Sikkim: [
    "Gangtok",
    "Gyalshing",
    "Mangan",
    "Namchi",
    "Pakyong",
    "Soreng",
  ],
  Tripura: [
    "Dhalai",
    "Gomati",
    "Khowai",
    "North Tripura",
    "Sepahijala",
    "South Tripura",
    "Unakoti",
    "West Tripura",
  ],
};

function sortByOrder(items) {
  return [...items].sort((left, right) => {
    const leftOrder = Number(left?.order ?? 0);
    const rightOrder = Number(right?.order ?? 0);

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return String(left?.id || "").localeCompare(String(right?.id || ""));
  });
}

export default function HomePage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("Assam - Kamrup Metropolitan");
  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [vehiclePrice, setVehiclePrice] = useState(100000);
  const [downPayment, setDownPayment] = useState(30000);
  const [loanTenure, setLoanTenure] = useState(60);
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);

  const calculateInterestRate = () => {
    return 9 + Math.min(3, (loanTenure - 12) / 36);
  };

  const interestRate = calculateInterestRate();

  const calculateEMI = () => {
    const principal = vehiclePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    if (monthlyRate === 0) {
      return (principal / loanTenure).toFixed(2);
    }

    const emi = (principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTenure))) / (Math.pow(1 + monthlyRate, loanTenure) - 1);
    return emi.toFixed(2);
  };

  const emi = calculateEMI();
  const totalAmount = (parseFloat(emi) * loanTenure).toFixed(2);
  const totalInterest = (totalAmount - (vehiclePrice - downPayment)).toFixed(2);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });

        if (!response.ok) {
          setIsAuthenticated(false);
          setAuthUser(null);
          return;
        }

        const data = await response.json();
        setIsAuthenticated(true);
        setAuthUser(data.user || null);
      } catch {
        setIsAuthenticated(false);
        setAuthUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadContent = async () => {
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (!isActive) {
          return;
        }

        if (Array.isArray(data.vehicles)) {
          setFeaturedVehicles(sortByOrder(data.vehicles));
        }

        if (Array.isArray(data.gallery)) {
          setGalleryPhotos(sortByOrder(data.gallery));
        }
      } catch {
        // Keep static fallback content when API is unavailable.
      }
    };

    loadContent();

    const intervalId = window.setInterval(loadContent, 5000);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const openAuthModal = (mode = "login") => {
    setAuthError("");
    setAuthMode(mode);
    setShowPassword(false);
    setAuthForm({ name: "", email: "", password: "" });
    setIsAuthModalOpen(true);
  };

  const requireAuth = (event) => {
    if (isAuthLoading) {
      event.preventDefault();
      return false;
    }

    if (isAuthenticated) {
      return true;
    }
    event.preventDefault();
    openAuthModal();
    return false;
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();

    if (!authForm.email.trim() || !authForm.password.trim()) {
      setAuthError("Email and password are required.");
      return;
    }

    if (authMode === "register" && !authForm.name.trim()) {
      setAuthError("Name is required for registration.");
      return;
    }

    const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: authForm.name,
          email: authForm.email,
          password: authForm.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.error || "Authentication failed.");
        return;
      }

      if (authMode === "register") {
        setAuthMode("login");
        setShowPassword(false);
        setAuthError("Registration successful. Please log in.");
        setAuthForm({ name: "", email: "", password: "" });
        return;
      }

      setIsAuthenticated(true);
      setAuthUser(data.user || null);
      setIsAuthModalOpen(false);
      setShowPassword(false);
      setAuthError("");
      setAuthForm({ name: "", email: "", password: "" });
    } catch {
      setAuthError("Unable to connect to server.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsAuthenticated(false);
      setAuthUser(null);
      setIsProfilePopupOpen(false);
    }
  };

  const userDisplayName = (authUser?.name || authUser?.email || "User").trim();
  const userFirstName = userDisplayName.split(/\s+/)[0] || "User";

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { redirectTo: "/" });
    } catch (error) {
      setAuthError("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#111827_0%,#06070b_45%,#020304_100%)] text-zinc-100">
      <section className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(120deg,rgba(0,0,0,0.72),rgba(15,23,42,0.45),rgba(0,0,0,0.82))]">
        <div className="mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col px-6 py-6 lg:px-10">
          <header className="flex items-center justify-between rounded-full border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-md">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Veichle</p>
              <h2 className="text-lg font-semibold text-white">Luxury Automotive</h2>
            </div>
            <div className="flex items-center gap-3 md:gap-6">
              <nav className="hidden gap-6 text-sm text-zinc-200 md:flex">
                <a href="#vehicles" className="hover:text-amber-300">Vehicles</a>
                <a href="#gallery" className="hover:text-amber-300">Gallery</a>
                <a href="#contact" className="hover:text-amber-300">Contact</a>
              </nav>

              <div className="flex items-center gap-3">
                <label htmlFor="northeast-district" className="hidden shrink-0 text-[11px] uppercase tracking-[0.22em] text-zinc-300 md:mr-1 md:block">
                  District
                </label>
                <div className="relative">
                  <i
                    className="icon-cd-locationPin pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-200"
                    aria-hidden="true"
                  ></i>
                  <select
                    id="northeast-district"
                    value={selectedDistrict}
                    onChange={(event) => setSelectedDistrict(event.target.value)}
                    className="max-w-32 rounded-full border border-white/20 bg-black/35 py-2 pl-8 pr-3 text-xs text-zinc-100 outline-none transition hover:border-amber-300 md:max-w-42.5"
                    aria-label="Select district in Northeast India"
                  >
                    {Object.entries(northeastDistricts).map(([state, districts]) => (
                      <optgroup key={state} label={state.replace("_", " ")}>
                        {districts.map((district) => (
                          <option
                            key={`${state}-${district}`}
                            value={`${state.replace("_", " ")} - ${district}`}
                            className="bg-zinc-900 text-zinc-100"
                          >
                            {district}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openAuthModal("login")}
                    className="px-1 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:text-amber-200"
                  >
                    Login
                  </button>
                  <span className="text-xs font-semibold text-zinc-400">/</span>
                  <button
                    type="button"
                    onClick={() => openAuthModal("register")}
                    className="px-1 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 transition hover:text-amber-100"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProfilePopupOpen((previous) => !previous)}
                    className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-300"
                  >
                    {userFirstName}
                  </button>

                  {isProfilePopupOpen && (
                    <div className="absolute right-0 top-12 z-30 min-w-64 rounded-2xl border border-white/15 bg-zinc-950/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">User profile</p>
                      <p className="mt-2 text-sm font-semibold text-white">{authUser?.name || "N/A"}</p>
                      <p className="mt-1 break-all text-xs text-zinc-300">{authUser?.email || "N/A"}</p>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-3 w-full rounded-full border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-red-300 hover:text-red-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </header>

          <div className="mt-16 grid flex-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl space-y-6">
              <p className="inline-flex items-center rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-200">
                Serving {selectedDistrict}, Northeast India
              </p>
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
                  onClick={(event) => {
                    if (!requireAuth(event)) return;
                    setIsPopupOpen(true);



                          }}
                  className={`rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 ${
                    !isAuthenticated ? "opacity-70" : ""
                  }`}
                >
                  PopUp card 
                </button>
               <Link
  href="/book-visit"
  onClick={(event) => {
    requireAuth(event);
  }}
  className={`rounded-full border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12 ${
    !isAuthenticated ? "opacity-70" : ""
  }`}
>
  Book a Visit
</Link>


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

          {!isAuthenticated && (
            <p className="text-sm text-amber-200/90">
              {isAuthLoading
                ? "Checking login session..."
                : "Login or register from the header to unlock all action buttons."}
            </p>
          )}
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



      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        <div className="rounded-3xl border border-white/10 bg-zinc-100 p-8 shadow-xl shadow-black/20 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">4 Simple Steps to</h2>
                <h2 className="text-4xl font-bold text-amber-600 md:text-5xl">Finance your car</h2>
                <div className="mt-8 flex justify-center">
                  <svg className="h-32 w-32 text-gray-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="35" cy="40" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M35 48 L35 65" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="65" cy="40" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M65 48 L65 65" stroke="currentColor" strokeWidth="2"/>
                    <path d="M43 55 L57 55" stroke="currentColor" strokeWidth="2"/>
                    <rect x="25" y="70" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="55" y="70" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-900 bg-white text-lg font-bold text-gray-900">1</div>
                    <div className="mt-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">VERIFY YOUR DETAILS</h3>
                      <p className="mt-2 text-xs leading-relaxed text-gray-700">Select your car and a ARENA dealership near you</p>
                    </div>
                  </div>
                  <div className="absolute left-16 top-6 hidden lg:block">
                    <svg className="h-8 w-8 text-gray-400" viewBox="0 0 60 24" fill="none">
                      <path d="M0 12 C 20 0, 40 24, 60 12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" fill="none"/>
                      <path d="M52 6 L60 12 L52 18" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-900 bg-white text-lg font-bold text-gray-900">2</div>
                    <div className="mt-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">SELECT THE LOAN OFFER</h3>
                      <p className="mt-2 text-xs leading-relaxed text-gray-700">Compare and select the best offer</p>
                    </div>
                  </div>
                  <div className="absolute left-16 top-6 hidden lg:block">
                    <svg className="h-8 w-8 text-gray-400" viewBox="0 0 60 24" fill="none">
                      <path d="M0 12 C 20 0, 40 24, 60 12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" fill="none"/>
                      <path d="M52 6 L60 12 L52 18" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-900 bg-white text-lg font-bold text-gray-900">3</div>
                    <div className="mt-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">UPLOAD YOUR DOCUMENTS</h3>
                      <p className="mt-2 text-xs leading-relaxed text-gray-700">Apply for the loan online by uploading digital documents</p>
                    </div>
                  </div>
                  <div className="absolute left-16 top-6 hidden lg:block">
                    <svg className="h-8 w-8 text-gray-400" viewBox="0 0 60 24" fill="none">
                      <path d="M0 12 C 20 0, 40 24, 60 12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" fill="none"/>
                      <path d="M52 6 L60 12 L52 18" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-900 bg-white text-lg font-bold text-gray-900">4</div>
                  <div className="mt-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">VERIFICATION</h3>
                    <p className="mt-2 text-xs leading-relaxed text-gray-700">Financier verifies and sanctions loan online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl shadow-black/20 md:p-10 backdrop-blur-xl">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">EMI Calculator</p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">Calculate your monthly payment</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold uppercase tracking-widest text-zinc-200 mb-3">
                  Vehicle Price: ₹{vehiclePrice.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="100000"
                  max="5000000"
                  step="100000"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-xs text-zinc-400 mt-1">
                  <span>₹1L</span>
                  <span>₹50L</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold uppercase tracking-widest text-zinc-200 mb-3">
                  Down Payment: ₹{downPayment.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max={vehiclePrice * 0.9}
                  step="10000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-xs text-zinc-400 mt-1">
                  <span>₹0</span>
                  <span>₹{(vehiclePrice * 0.9).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-rose-400/30 bg-rose-400/5 p-4">
                <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">Interest Rate (Auto-calculated)</p>
                <p className="text-3xl font-bold text-rose-300">{interestRate.toFixed(2)}%</p>
                <p className="text-xs text-zinc-400 mt-2">Based on {loanTenure} month tenure: Starting at 9% for 1 year</p>
              </div>

              <div>
                <label className="block text-sm font-semibold uppercase tracking-widest text-zinc-200 mb-3">
                  Loan Tenure: {loanTenure} months
                </label>
                <input
                  type="range"
                  min="12"
                  max="120"
                  step="6"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
                <div className="flex justify-between text-xs text-zinc-400 mt-1">
                  <span>12 months (1 year)</span>
                  <span>120 months (10 years)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="rounded-2xl border border-white/15 bg-white/6 p-8 backdrop-blur-xl w-full">
                <div className="space-y-6 text-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-2">Monthly EMI</p>
                    <p className="text-5xl font-black text-amber-400">₹{emi.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-300">Loan Amount</span>
                      <span className="text-lg font-semibold text-white">₹{(vehiclePrice - downPayment).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-300">Total Interest</span>
                      <span className="text-lg font-semibold text-rose-300">₹{totalInterest.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-300">Total Amount Payable</span>
                      <span className="text-lg font-semibold text-emerald-300">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="vehicles" className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Featured vehicles</p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">Curated for power, comfort, and presence.</h2>
          </div>
          <a
            href="#contact"
            onClick={(event) => {
              requireAuth(event);
            }}
            className={`hidden rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:border-amber-300 hover:text-amber-200 md:block ${
              !isAuthenticated ? "opacity-70" : ""
            }`}
          >
            Request a private viewing
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredVehicles.map((vehicle, index) => (
            <article
              key={vehicle.id || `${vehicle.name || "vehicle"}-${vehicle.order ?? index}`}
              className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/90 shadow-2xl shadow-black/30"
            >
              {(vehicle.image || vehicle.images?.[0]) && (
                <img
                  src={vehicle.image || vehicle.images?.[0]}
                  alt={vehicle.name}
                  className="h-52 w-full object-cover"
                />
              )}
              {!(vehicle.image || vehicle.images?.[0]) && (
                <div className="h-52 w-full bg-zinc-900 flex items-center justify-center">
                  <p className="text-zinc-400 text-sm">No image available</p>
                </div>
              )}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-amber-300">{vehicle.category}</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{vehicle.name}</h3>
                  </div>
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm text-amber-200">{vehicle.price}</span>
                </div>
                <p className="text-sm text-zinc-300">{vehicle.description}</p>
                <Link
  href={`/products/${vehicle.id}`}
  onClick={(event) => {
    requireAuth(event);
  }}
  className={`inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300 ${
    !isAuthenticated ? "opacity-70" : ""
  }`}
>
  View Details
</Link>
              </div>
            </article>
          ))}
          {featuredVehicles.length === 0 && (
            <article className="md:col-span-2 xl:col-span-3 rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">No featured vehicles</p>
              <p className="mt-3 text-zinc-300">
                Featured vehicles will appear here after adding them from the admin panel.
              </p>
            </article>
          )}
        </div>
      </section>

      <section id="gallery" className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Gallery</p>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">A glimpse into the showroom experience.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {galleryPhotos.filter((photo) => photo?.imageUrl).map((photo, index) => (
            <article key={photo.id || index} className="overflow-hidden rounded-3xl border border-white/10 bg-white/6 shadow-xl shadow-black/20">
              <img
                src={photo.imageUrl}
                alt={photo.title || `Gallery image ${index + 1}`}
                className="h-56 w-full object-cover transition duration-500 hover:scale-105"
              />
            </article>
          ))}
          {galleryPhotos.length === 0 && (
            <article className="md:col-span-2 xl:col-span-4 rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">No gallery photos</p>
              <p className="mt-3 text-zinc-300">
                Gallery photos will appear here after adding them from the admin panel.
              </p>
            </article>
          )}
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

      {isAuthModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/60">
            <p className="text-center text-xs uppercase tracking-[0.35em] text-amber-300">Account Access</p>
            <h3 className="mt-3 text-center text-2xl font-bold text-white">
              {authMode === "register" ? "Register" : "Login"}
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  authMode === "login" ? "bg-white/15 text-white" : "text-zinc-300 hover:bg-white/10"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  authMode === "register" ? "bg-white/15 text-white" : "text-zinc-300 hover:bg-white/10"
                }`}
              >
                Register
              </button>
            </div>

            {isAuthenticated && authUser && (
              <p className="mt-2 text-center text-sm text-emerald-300">
                Logged in as {authUser.name || authUser.email}
              </p>
            )}

            <form className="mt-5 space-y-4" onSubmit={handleAuthSubmit}>
              {authMode === "register" && (
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(event) =>
                    setAuthForm({
                      ...authForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none"
                />
              )}

              <input
                type="email"
                value={authForm.email}
                onChange={(event) =>
                  setAuthForm({
                    ...authForm,
                    email: event.target.value,
                  })
                }
                placeholder="Email Address"
                className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={authForm.password}
                  onChange={(event) =>
                    setAuthForm({
                      ...authForm,
                      password: event.target.value,
                    })
                  }
                  placeholder="Password"
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-3 pr-12 text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-1.5 text-zinc-200 transition hover:bg-white/10 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="block text-lg leading-none">
                    {showPassword ? "🙈" : "👁"}
                  </span>
                </button>
              </div>

              {authError && <p className="text-sm text-red-400">{authError}</p>}

              <button
                type="submit"
                className="w-full rounded-full bg-amber-400 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
              >
                {authMode === "register" ? "Register Now" : "Login Now"}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-zinc-950 px-2 text-zinc-400">Or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full rounded-full bg-white/10 border border-white/20 py-3 text-sm font-semibold text-white transition hover:bg-white/20 flex items-center justify-center gap-1.5"
              >
                <svg className="h-2 w-2 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.66z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3c-1.08.73-2.46 1.16-4.05 1.16-3.11 0-5.74-2.1-6.68-4.92H1.31v3.09A12 12 0 0 0 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.32 14.34A7.2 7.2 0 0 1 4.95 12c0-.81.14-1.59.37-2.34V6.57H1.31A12 12 0 0 0 0 12c0 1.93.46 3.75 1.31 5.43l4.01-3.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.74c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.94 1.2 15.24 0 12 0A12 12 0 0 0 1.31 6.57l4.01 3.09c.94-2.82 3.57-4.92 6.68-4.92z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>

            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="mt-4 w-full rounded-full border border-white/20 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <footer className="border-t border-white/10 bg-black/30 py-6 text-center text-sm text-zinc-300">© {new Date().getFullYear()} Veichle. Premium automotive experiences.</footer>
    </main>
  );
}
