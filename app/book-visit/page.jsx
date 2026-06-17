
"use client";

import Link from "next/link";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";

export default function BookVisit() {
      const [selectedDate, setSelectedDate] = useState(null);
const [isPopupOpen, setIsPopupOpen] = useState(false);

const [popupTitle, setPopupTitle] = useState("");
const [popupMessage, setPopupMessage] = useState([]);


const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  phone: "",
  vehicle: "",
  requirements: "",
});
const [errors, setErrors] = useState({});


return ( <main className="min-h-screen bg-[radial-gradient(circle_at_top,#111827_0%,#06070b_45%,#020304_100%)] text-zinc-100">

```
  {/* Hero Section */}
  <section className="relative overflow-hidden border-b border-white/10">
    <img
      src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80"
      alt="Luxury Vehicle"
      className="absolute inset-0 h-full w-full object-cover"
    />

    <div className="absolute inset-0 bg-black/70" />

    <div className="relative max-w-7xl mx-auto px-6 py-24 lg:px-10">
      <Link
        href="/"
        className="inline-flex items-center text-amber-300 hover:text-amber-200"
      >
        ← Back to Home
      </Link>

      <div className="mt-12 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
          Private Luxury Experience
        </p>

        <h1 className="mt-4 text-5xl md:text-7xl font-black text-white">
          Book Your Showroom Visit
        </h1>

        <p className="mt-6 text-xl text-zinc-300">
          Schedule a personalized consultation, private vehicle viewing,
          and exclusive test drive experience with our automotive experts.
        </p>
      </div>
    </div>
  </section>

  {/* Booking Section */}
  <section className="max-w-7xl mx-auto px-6 py-16 lg:px-10">
    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">

      {/* Form */}
      <div className="rounded-3xl border border-white/10 bg-white/6 p-8 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
          Appointment Request
        </p>

        <h2 className="mt-3 text-3xl font-bold">
          Reserve Your Visit 
        </h2>
        
<form
  className="mt-8 space-y-5"
  onSubmit={(e) => {
  e.preventDefault();

  const newErrors = {};

  if (!formData.fullName.trim()) {
    newErrors.fullName = "Full Name is required";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email Address is required";
  }

  if (!formData.phone.trim()) {
    newErrors.phone = "Phone Number is required";
  }

  if (!formData.vehicle) {
    newErrors.vehicle = "Please select a vehicle";
  }

  if (!selectedDate) {
    newErrors.date = "Please select a visit date";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return;
  }

  setPopupTitle("Appointment Confirmed");
  setPopupMessage([
    "Your showroom visit has been booked successfully.",
    "Our luxury concierge team will contact you shortly.",
  ]);

  setIsPopupOpen(true);

  setFormData({
    fullName: "",
    email: "",
    phone: "",
    vehicle: "",
    requirements: "",
  });

  setSelectedDate(null);
}}
>
  <input
    type="text"
    placeholder="Full Name"
    value={formData.fullName}
    onChange={(e) =>
      setFormData({
        ...formData,
        fullName: e.target.value,
      })
    }
    className="w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none"
  />

  
  {errors.fullName && (
  <p className="text-red-400 text-sm">
    {errors.fullName}
  </p>
)}

  <input
    type="email"
    placeholder="Email Address"
    value={formData.email}
    onChange={(e) =>
      setFormData({
        ...formData,
        email: e.target.value,
      })
    }
    className="w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none"
  />

  {errors.email && (
  <p className="text-red-400 text-sm">
    {errors.email}
  </p>
)}


  <input
    type="tel"
    placeholder="Phone Number"
    value={formData.phone}
    onChange={(e) =>
      setFormData({
        ...formData,
        phone: e.target.value,
      })
    }
    className="w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none"
  />

  {errors.phone && (
  <p className="text-red-400 text-sm">
    {errors.phone}
  </p>
)}



  <select
    value={formData.vehicle}
    onChange={(e) =>
      setFormData({
        ...formData,
        vehicle: e.target.value,
      })
    }
    className="w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none"
  >
    <option value="">Select Vehicle</option>
    <option>Aether S Coupe</option>
    <option>Velvet X SUV</option>
    <option>Nova GT R</option>
  </select>

  {errors.vehicle && (
  <p className="text-red-400 text-sm">
    {errors.vehicle}
  </p>
)}

  <DatePicker
    selected={selectedDate}
    onChange={(date) => setSelectedDate(date)}
    dateFormat="dd/MM/yyyy"
    showMonthDropdown
    showYearDropdown
    dropdownMode="select"
    minDate={new Date()}
    placeholderText="Select Visit Date"
    className="w-full rounded-xl border border-white/10 bg-black/30 p-4 text-white outline-none"
  />

  {errors.date && (
  <p className="text-red-400 text-sm">
    {errors.date}
  </p>
)}

  <textarea
    rows="5"
    placeholder="Additional Requirements"
    value={formData.requirements}
    onChange={(e) =>
      setFormData({
        ...formData,
        requirements: e.target.value,
      })
    }
    className="w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none"
  />

  <button
    type="submit"
    className="w-full rounded-full bg-amber-400 py-4 text-black font-semibold hover:bg-amber-300 transition"
  >
    Book Appointment
  </button>
</form>
</div>
        

      {/* Sidebar */}
      <div className="space-y-6">

        <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
          <h3 className="text-xl font-semibold text-white">
            Why Visit Us?
          </h3>

          <ul className="mt-5 space-y-4 text-zinc-300">
            <li>✓ Private showroom access</li>
            <li>✓ Dedicated luxury consultant</li>
            <li>✓ Exclusive test drive session</li>
            <li>✓ Vehicle customization guidance</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
          <h3 className="text-xl font-semibold text-white">
            Contact Details
          </h3>

          <div className="mt-5 space-y-3 text-zinc-300">
            <p>📍 18 Aurora Avenue, Downtown District</p>
            <p>📞 +1 (555) 238-9010</p>
            <p>✉️ hello@veichle.example</p>
          </div>
        </div>

      </div>
    </div>
  </section>
{isPopupOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/50">

      <p className="text-sm uppercase tracking-[0.35em] text-amber-300 text-center">
        {popupTitle}
      </p>

      <div className="mt-5">
        {popupMessage.map((item, index) => (
          <p
            key={index}
            className="text-zinc-200 py-1"
          >
            • {item}
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setIsPopupOpen(false)}
        className="mt-6 w-full rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
      >
        Close
      </button>
    </div>
  </div>
)}

  <footer className="border-t border-white/10 bg-black/30 py-6 text-center text-sm text-zinc-300">
    © {new Date().getFullYear()} Veichle. Premium automotive experiences.
  </footer>
</main>

);
}
