'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle } from './theme-provider';

function AirplaneHero({ size = 140 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Fuselage */}
      <ellipse cx="65" cy="28" rx="48" ry="9" fill="#f0ebe0"/>
      {/* Underbelly shadow */}
      <path d="M17 28 C17 34 40 37 65 37 C90 37 113 34 113 28" fill="#2a5a6a" opacity="0.9"/>
      {/* Wing */}
      <path d="M50 32 L38 52 L82 52 L72 32Z" fill="#2a5a6a"/>
      {/* Wing highlight */}
      <path d="M52 32 L44 46 L76 46 L70 32Z" fill="#3a7a8a" opacity="0.4"/>
      {/* Tail fin */}
      <path d="M18 28 L10 12 L24 14 L22 28Z" fill="#2a5a6a"/>
      {/* Tail body */}
      <path d="M18 22 L14 16 L22 17Z" fill="#f0ebe0"/>
      {/* Engines */}
      <ellipse cx="52" cy="44" rx="5" ry="3.5" fill="#3a6a7a"/>
      <ellipse cx="72" cy="44" rx="5" ry="3.5" fill="#3a6a7a"/>
      {/* Engine intakes */}
      <ellipse cx="52" cy="44" rx="3" ry="2" fill="#1a3a4a"/>
      <ellipse cx="72" cy="44" rx="3" ry="2" fill="#1a3a4a"/>
      {/* Windows */}
      <g fill="#5b9bd5">
        <rect x="35" y="25" width="3" height="4" rx="1.5"/>
        <rect x="42" y="25" width="3" height="4" rx="1.5"/>
        <rect x="49" y="25" width="3" height="4" rx="1.5"/>
        <rect x="56" y="25" width="3" height="4" rx="1.5"/>
        <rect x="63" y="25" width="3" height="4" rx="1.5"/>
        <rect x="70" y="25" width="3" height="4" rx="1.5"/>
        <rect x="77" y="25" width="3" height="4" rx="1.5"/>
        <rect x="84" y="25" width="3" height="4" rx="1.5"/>
        <rect x="91" y="25" width="3" height="4" rx="1.5"/>
      </g>
      {/* Cockpit windows */}
      <path d="M108 24 Q113 28 108 32" fill="#4a9aba" opacity="0.8"/>
      {/* Nose */}
      <ellipse cx="112" cy="28" rx="4" ry="8" fill="#f0ebe0"/>
    </svg>
  );
}

function SmallPlaneIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"
        fill="currentColor"/>
    </svg>
  );
}

function RetroPosterBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
        {/* Solid sky blue background */}
        <rect width="1200" height="800" fill="#5b9bd5"/>

        {/* Large sun circle at bottom-center */}
        <circle cx="600" cy="720" r="380" fill="#f0e8a0" opacity="0.9"/>
        <circle cx="600" cy="720" r="320" fill="#f0e8a0" opacity="0.5"/>

        {/* Cream clouds top — filled overlapping ellipses */}
        {/* Cloud group 1 — top left */}
        <ellipse cx="180" cy="140" rx="60" ry="30" fill="#f5e8c8"/>
        <ellipse cx="220" cy="130" rx="50" ry="28" fill="#f5e8c8"/>
        <ellipse cx="150" cy="148" rx="45" ry="22" fill="#f5e8c8"/>
        <ellipse cx="200" cy="120" rx="35" ry="20" fill="#fff8e8"/>

        {/* Cloud group 2 — top center */}
        <ellipse cx="550" cy="100" rx="70" ry="32" fill="#f5e8c8"/>
        <ellipse cx="600" cy="90" rx="55" ry="28" fill="#f5e8c8"/>
        <ellipse cx="520" cy="108" rx="45" ry="22" fill="#f5e8c8"/>
        <ellipse cx="570" cy="82" rx="38" ry="20" fill="#fff8e8"/>

        {/* Cloud group 3 — top right */}
        <ellipse cx="920" cy="120" rx="65" ry="30" fill="#f5e8c8"/>
        <ellipse cx="960" cy="110" rx="50" ry="26" fill="#f5e8c8"/>
        <ellipse cx="890" cy="128" rx="40" ry="20" fill="#f5e8c8"/>
        <ellipse cx="940" cy="100" rx="32" ry="18" fill="#fff8e8"/>

        {/* Coral + orange layered clouds at bottom */}
        <ellipse cx="250" cy="640" rx="280" ry="65" fill="#e89050" opacity="0.8"/>
        <ellipse cx="800" cy="660" rx="320" ry="70" fill="#e87060" opacity="0.75"/>
        <ellipse cx="550" cy="680" rx="400" ry="80" fill="#e87060" opacity="0.6"/>
        <ellipse cx="100" cy="700" rx="200" ry="55" fill="#e89050" opacity="0.7"/>
        <ellipse cx="1050" cy="690" rx="250" ry="60" fill="#e89050" opacity="0.65"/>

        {/* Plum mountains at very bottom */}
        <path d="M0 740 L120 680 L280 720 L420 660 L580 710 L720 650 L880 700 L1020 670 L1120 710 L1200 680 L1200 800 L0 800Z" fill="#5a3050" opacity="0.9"/>
        <path d="M0 760 L180 740 L380 755 L520 730 L720 750 L920 735 L1060 755 L1200 740 L1200 800 L0 800Z" fill="#5a3050"/>

        {/* Contrail streaks */}
        <line x1="80" y1="310" x2="680" y2="270" stroke="#f5e0b0" strokeWidth="5" opacity="0.6" strokeLinecap="round"/>
        <line x1="120" y1="324" x2="640" y2="287" stroke="#f5e0b0" strokeWidth="3" opacity="0.35" strokeLinecap="round"/>
        <line x1="720" y1="340" x2="1140" y2="300" stroke="#f5e0b0" strokeWidth="4" opacity="0.5" strokeLinecap="round"/>

        {/* Large airplane flying diagonally — cream body, teal underbelly */}
        <g transform="translate(650, 250) rotate(-6)">
          <ellipse cx="65" cy="28" rx="48" ry="9" fill="#f0ebe0"/>
          <path d="M17 28 C17 34 40 37 65 37 C90 37 113 34 113 28" fill="#2a5a6a" opacity="0.9"/>
          <path d="M50 32 L38 52 L82 52 L72 32Z" fill="#2a5a6a"/>
          <path d="M52 32 L44 46 L76 46 L70 32Z" fill="#3a7a8a" opacity="0.4"/>
          <path d="M18 28 L10 12 L24 14 L22 28Z" fill="#2a5a6a"/>
          <path d="M18 22 L14 16 L22 17Z" fill="#f0ebe0"/>
          <ellipse cx="52" cy="44" rx="5" ry="3.5" fill="#3a6a7a"/>
          <ellipse cx="72" cy="44" rx="5" ry="3.5" fill="#3a6a7a"/>
          <ellipse cx="52" cy="44" rx="3" ry="2" fill="#1a3a4a"/>
          <ellipse cx="72" cy="44" rx="3" ry="2" fill="#1a3a4a"/>
          <g fill="#5b9bd5">
            <rect x="35" y="25" width="3" height="4" rx="1.5"/>
            <rect x="42" y="25" width="3" height="4" rx="1.5"/>
            <rect x="49" y="25" width="3" height="4" rx="1.5"/>
            <rect x="56" y="25" width="3" height="4" rx="1.5"/>
            <rect x="63" y="25" width="3" height="4" rx="1.5"/>
            <rect x="70" y="25" width="3" height="4" rx="1.5"/>
            <rect x="77" y="25" width="3" height="4" rx="1.5"/>
            <rect x="84" y="25" width="3" height="4" rx="1.5"/>
            <rect x="91" y="25" width="3" height="4" rx="1.5"/>
          </g>
          <path d="M108 24 Q113 28 108 32" fill="#4a9aba" opacity="0.8"/>
          <ellipse cx="112" cy="28" rx="4" ry="8" fill="#f0ebe0"/>
        </g>
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const [code, setCode] = useState('');
  const router = useRouter();
  const { userId } = useUserStore();

  const handleJoin = () => {
    if (code.length === 6) router.push(`/room/${code.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <RetroPosterBg />
      <ThemeToggle />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-sm text-center"
      >
        {/* Hero airplane */}
        <motion.div
          className="mb-8 inline-block"
          animate={{ y: [0, -6, 0], rotate: [0, 1, -1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AirplaneHero size={160} />
        </motion.div>

        <h1 className="heading text-4xl font-bold mb-2 text-white drop-shadow-md">
          Paper Plane
        </h1>
        <p className="text-sm mb-10 text-white/80">
          Your thoughts take flight
        </p>

        {/* Card */}
        <div className="card relative overflow-hidden">
          <label className="block text-left text-[10px] uppercase tracking-widest font-medium mb-2 fids-font" style={{ color: 'var(--ink-muted)' }}>
            Room Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
            placeholder="_ _ _ _ _ _"
            maxLength={6}
            className="input-flight"
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          />
          <button
            onClick={handleJoin}
            disabled={code.length !== 6}
            className="btn-takeoff w-full mt-5"
          >
            <span>Board Flight</span>
            <SmallPlaneIcon size={20} />
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-white/70">
          Organizer?{' '}
          <button onClick={() => router.push(userId ? '/dashboard' : '/login')} className="font-semibold underline underline-offset-2 text-white">
            {userId ? 'Dashboard' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
