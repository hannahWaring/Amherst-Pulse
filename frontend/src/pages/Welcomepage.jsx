import React, { useState } from "react";
import { MapPin, Compass, ArrowRight, X } from "lucide-react";

const pins = [
  { top: "38%", left: "18%", color: "#14b8a6" },
  { top: "32%", left: "68%", color: "#8b5cf6" },
  { top: "53%", left: "46%", color: "#fbbf24" },
  { top: "58%", left: "82%", color: "#f97316" },
];

export default function WelcomePage({ onGetStarted }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f3ff]">
      <div className="mx-auto w-full max-w-none px-4 pt-8 pb-8 md:px-8">
        {/* Background map */}
        <img
          src="/isometric-3d-map.png"
          alt="Illustrated campus map"
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
        />

        {/* Header */}
        <header className="relative z-20 flex items-center justify-center gap-5">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6d28d9] to-[#8b5cf6] shadow-lg">
              <MapPin className="h-10 w-10 text-white" strokeWidth={2.5} />
            </div>

            <div className="flex min-w-0 flex-col items-start">
              <h1
                style={{
                  color: "#1f2757",
                  fontSize: "80px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  lineHeight: 1.1,
                }}
                className="whitespace-nowrap"
              >
                Campus <span style={{ color: "#6b4df6" }}>Pulze</span>
              </h1>

              <p className="mt-2 text-base font-medium text-[#5f6b8a] sm:text-lg md:text-xl">
                Discover Amherst. Share your places.
              </p>
            </div>
          </div>
        </header>

        {/* Hero section */}
        <div className="relative mt-6 h-[calc(100svh-190px)] min-h-[480px] overflow-hidden">
          {/* Map pins */}
          {pins.map((pin, index) => (
            <div
              key={index}
              className="absolute z-10 -translate-x-1/2 -translate-y-full"
              style={{
                top: pin.top,
                left: pin.left,
              }}
            >
              <MapPin
                size={64}
                strokeWidth={1.5}
                fill={pin.color}
                color={pin.color}
                className="drop-shadow-lg"
              />

              <div className="absolute left-1/2 top-[38%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            </div>
          ))}

          {/* Information card */}
          <div className="absolute bottom-[8%] left-[5%] z-20 flex items-center gap-4 rounded-2xl border border-white/80 bg-white/95 px-6 py-5 shadow-xl backdrop-blur-sm">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
              <Compass className="h-7 w-7 text-indigo-600" />
            </div>

            <div className="text-left">
              <h2
                style={{ color: "#1f2757" }}
                className="text-base font-bold leading-snug md:text-lg"
              >
                Events, RSO activities.
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                All in one map.
              </p>
            </div>
          </div>

          {/* Get Started button */}
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className="fixed left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-2xl bg-white px-9 py-5 text-xl font-bold text-[#6b4df6] shadow-xl transition-transform hover:scale-105"
          >
            <span>Get Started</span>
          </button>
        </div>
      </div>

      {/* Login overlay */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          {/* Login card */}
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close login"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Login heading */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6d28d9] to-[#8b5cf6]">
                <MapPin className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>

              <h2 className="text-3xl font-bold text-[#1f2757]">
                Welcome to Campus Pulze
              </h2>
            </div>

            {/* Login form */}
            <form className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              {/* Login button */}
              {/* Login button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-700 hover:to-violet-700"
              >
                Log In
              </button>

              {/* Guest option */}
              <div className="relative my-6 flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="mx-4 text-sm text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowLogin(false);
                  onGetStarted?.();
                }}
                className="w-full rounded-xl border-2 border-[#6b4df6] bg-white py-3 font-semibold text-[#6b4df6] transition hover:bg-[#f5f3ff]"
              >
                Continue as Guest
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
