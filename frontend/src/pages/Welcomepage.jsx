
import React from 'react';
import { MapPin, Compass, ArrowRight } from 'lucide-react';

const pins = [
  { top: '38%', left: '18%', color: '#14b8a6' },
  { top: '32%', left: '68%', color: '#8b5cf6' },
  { top: '53%', left: '46%', color: '#fbbf24' },
  { top: '58%', left: '82%', color: '#f97316' },
];

export default function WelcomePage({ onGetStarted }) {
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
                    color: '#1f2757',
                        fontSize: '80px',
                        fontWeight: 900,
                        letterSpacing: '1px',
                        lineHeight: 1.1,
                }}
                className=" whitespace-nowrap " >
                Campus <span style={{ color: '#6b4df6' }}>Pulze</span>
                </h1>

            <p className="mt-2 text-base font-medium text-[#5f6b8a] sm:text-lg md:text-xl">
                Discover Amherst. Share your places.
            </p>
            </div>
            </div>
        </header>

        {/* Hero illustration */}
<div className="relative mt-6 h-[calc(100svh-190px)] min-h-[480px] overflow-hidden">

          

          {/* Pins */}
          {pins.map((pin, index) => (
            <div
              key={index}
              className="absolute z-10  -translate-x-1/2 -translate-y-full"
              style={{
                top: pin.top,
                left: pin.left,
              }}
            >
              <MapPin 
              size = {64}
              strokeWidth = {1.5}
              fill = {pin.color}
              color = {pin.color}
              className = "drop-shadow-lg"
              />
            <div className="absolute left-1/2 top-[38%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            </div>
          ))}

          {/* Card info */}
        <div className="absolute bottom-[8%] left-[5%] z-20 flex items-center gap-4 rounded-2xl border border-white/80 bg-white/95 px-6 py-5 shadow-xl backdrop-blur-sm">
  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
    <Compass className="h-7 w-7 text-indigo-600" />
  </div>

  <div className="text-left">
    <h2
      style={{ color: '#1f2757' }}
      className="text-base font-bold leading-snug md:text-lg"
    >
      Events, RSO activities.
    </h2>
    <p className="mt-1 text-sm font-medium text-slate-500">
      All in one map.
    </p>
  </div>
</div>
         {/* Button */}
          <button
  type="button"
  onClick={onGetStarted}
  className="absolute bottom-[11%] right-[5%] z-30 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-4 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700"
>
  <span>Explore Map</span>
  <ArrowRight className="h-5 w-5" />
</button>

        </div>

      </div>
    </main>
  );
}
