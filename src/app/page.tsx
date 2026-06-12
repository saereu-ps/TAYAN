'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle } from './theme-provider';

function AirplaneIcon({ size = 64, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z" 
        fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
      <circle cx="38" cy="31" r="1" fill="white" opacity="0.6"/>
      <circle cx="42" cy="31" r="1" fill="white" opacity="0.6"/>
      <circle cx="46" cy="31" r="1" fill="white" opacity="0.6"/>
      <circle cx="50" cy="31" r="1" fill="white" opacity="0.6"/>
    </svg>
  );
}

function AirportBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
        {/* Runway in perspective */}
        <g opacity="0.18">
          <path d="M400 800 L500 450 L700 450 L800 800Z" fill="rgba(90,154,207,0.15)" stroke="#5a9acf" strokeWidth="1.5"/>
          {/* Center line dashes */}
          <line x1="600" y1="800" x2="600" y2="460" stroke="#e8c840" strokeWidth="2.5" strokeDasharray="30 20"/>
          {/* Threshold stripes */}
          <line x1="480" y1="780" x2="520" y2="500" stroke="rgba(232,200,64,0.7)" strokeWidth="4"/>
          <line x1="530" y1="780" x2="555" y2="500" stroke="rgba(232,200,64,0.7)" strokeWidth="4"/>
          <line x1="670" y1="780" x2="645" y2="500" stroke="rgba(232,200,64,0.7)" strokeWidth="4"/>
          <line x1="720" y1="780" x2="680" y2="500" stroke="rgba(232,200,64,0.7)" strokeWidth="4"/>
        </g>

        {/* Runway edge lights */}
        <g opacity="0.6">
          <circle cx="420" cy="750" r="3" fill="#e8c840"/>
          <circle cx="435" cy="700" r="2.5" fill="#e8c840"/>
          <circle cx="450" cy="650" r="2.5" fill="#e8c840"/>
          <circle cx="465" cy="600" r="2" fill="#e8c840"/>
          <circle cx="480" cy="550" r="2" fill="#e8c840"/>
          <circle cx="495" cy="500" r="1.5" fill="#e8c840"/>
          <circle cx="780" cy="750" r="3" fill="#e8c840"/>
          <circle cx="765" cy="700" r="2.5" fill="#e8c840"/>
          <circle cx="750" cy="650" r="2.5" fill="#e8c840"/>
          <circle cx="735" cy="600" r="2" fill="#e8c840"/>
          <circle cx="720" cy="550" r="2" fill="#e8c840"/>
          <circle cx="705" cy="500" r="1.5" fill="#e8c840"/>
        </g>

        {/* Control tower */}
        <g opacity="0.18" fill="rgba(90,154,207,0.3)" stroke="#5a9acf" strokeWidth="1.2">
          <rect x="100" y="380" width="35" height="130" rx="2"/>
          <rect x="88" y="355" width="60" height="30" rx="4"/>
          {/* Tower windows */}
          <rect x="95" y="362" width="10" height="14" rx="1" fill="rgba(232,200,64,0.3)"/>
          <rect x="110" y="362" width="10" height="14" rx="1" fill="rgba(232,200,64,0.3)"/>
          <rect x="125" y="362" width="10" height="14" rx="1" fill="rgba(232,200,64,0.3)"/>
          {/* Antenna */}
          <line x1="118" y1="355" x2="118" y2="330" strokeWidth="1.5"/>
          <circle cx="118" cy="328" r="3" fill="rgba(232,50,50,0.5)"/>
        </g>

        {/* Parked aircraft — filled shapes */}
        <g opacity="0.15">
          {/* Aircraft 1 */}
          <g transform="translate(200, 550) rotate(-8)">
            <path d="M0 0 L60 -3 L70 0 L60 3 L0 0Z" fill="rgba(90,154,207,0.4)" stroke="#5a9acf" strokeWidth="0.8"/>
            <path d="M20 -3 L15 -15 L40 -15 L35 -3" fill="rgba(90,154,207,0.3)" stroke="#5a9acf" strokeWidth="0.6"/>
            <path d="M20 3 L15 15 L40 15 L35 3" fill="rgba(90,154,207,0.3)" stroke="#5a9acf" strokeWidth="0.6"/>
          </g>
          {/* Aircraft 2 */}
          <g transform="translate(900, 520) rotate(5)">
            <path d="M0 0 L50 -2 L58 0 L50 2 L0 0Z" fill="rgba(90,154,207,0.4)" stroke="#5a9acf" strokeWidth="0.8"/>
            <path d="M15 -2 L12 -12 L32 -12 L29 -2" fill="rgba(90,154,207,0.3)" stroke="#5a9acf" strokeWidth="0.6"/>
            <path d="M15 2 L12 12 L32 12 L29 2" fill="rgba(90,154,207,0.3)" stroke="#5a9acf" strokeWidth="0.6"/>
          </g>
          {/* Aircraft 3 on taxiway */}
          <g transform="translate(850, 680) rotate(-3)">
            <path d="M0 0 L40 -2 L46 0 L40 2 L0 0Z" fill="rgba(90,154,207,0.35)" stroke="#5a9acf" strokeWidth="0.6"/>
            <path d="M12 -2 L10 -9 L25 -9 L23 -2" fill="rgba(90,154,207,0.25)" stroke="#5a9acf" strokeWidth="0.5"/>
            <path d="M12 2 L10 9 L25 9 L23 2" fill="rgba(90,154,207,0.25)" stroke="#5a9acf" strokeWidth="0.5"/>
          </g>
        </g>

        {/* Terminal building */}
        <g opacity="0.12" fill="rgba(90,154,207,0.2)" stroke="#5a9acf" strokeWidth="0.8">
          <rect x="250" y="430" width="400" height="35" rx="3"/>
          {/* Gates/windows */}
          <rect x="270" y="436" width="18" height="22" rx="2" fill="rgba(232,200,64,0.15)"/>
          <rect x="300" y="436" width="18" height="22" rx="2" fill="rgba(232,200,64,0.15)"/>
          <rect x="330" y="436" width="18" height="22" rx="2" fill="rgba(232,200,64,0.15)"/>
          <rect x="360" y="436" width="18" height="22" rx="2" fill="rgba(232,200,64,0.15)"/>
          <rect x="450" y="436" width="18" height="22" rx="2" fill="rgba(232,200,64,0.15)"/>
          <rect x="480" y="436" width="18" height="22" rx="2" fill="rgba(232,200,64,0.15)"/>
          <rect x="510" y="436" width="18" height="22" rx="2" fill="rgba(232,200,64,0.15)"/>
          <rect x="540" y="436" width="18" height="22" rx="2" fill="rgba(232,200,64,0.15)"/>
          {/* Jetbridges */}
          <path d="M290 465 L290 490 L305 490" strokeWidth="2" fill="none"/>
          <path d="M370 465 L370 495 L385 495" strokeWidth="2" fill="none"/>
          <path d="M490 465 L490 485 L505 485" strokeWidth="2" fill="none"/>
        </g>

        {/* Approach lights */}
        <g opacity="0.5">
          <circle cx="600" cy="440" r="3" fill="#e8c840"/>
          <circle cx="600" cy="420" r="2.5" fill="#e8c840"/>
          <circle cx="600" cy="400" r="2" fill="#d4883a"/>
          <circle cx="600" cy="380" r="2" fill="#d4883a"/>
          <circle cx="600" cy="360" r="1.5" fill="#d4883a"/>
        </g>

        {/* Horizon */}
        <line x1="0" y1="440" x2="1200" y2="440" stroke="#5a9acf" strokeWidth="0.8" opacity="0.15"/>
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
      <AirportBg />
      <ThemeToggle />

      {/* Ambient glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--amber-glow) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--teal-glow) 0%, transparent 70%)' }} />

      {/* Floating aircraft in sky */}
      {[
        { x: '6%', y: '12%', size: 48, delay: 0, rotate: -5 },
        { x: '80%', y: '8%', size: 36, delay: 2, rotate: 12 },
        { x: '88%', y: '60%', size: 28, delay: 4, rotate: -10 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none z-0"
          style={{ left: p.x, top: p.y, color: 'var(--ink)', opacity: 0.12, transform: `rotate(${p.rotate}deg)` }}
          animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
          transition={{ duration: 10 + i * 3, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        >
          <AirplaneIcon size={p.size} />
        </motion.div>
      ))}

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
          style={{ color: 'var(--ink)' }}
          animate={{ y: [0, -6, 0], rotate: [0, 1, -1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AirplaneIcon size={120} />
        </motion.div>

        <h1 className="heading text-3xl font-bold mb-2">
          Paper Plane
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--ink-muted)' }}>
          Your thoughts take flight
        </p>

        {/* Card — Flight Board style */}
        <div className="card relative overflow-hidden">
          {/* Airline gradient stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4b2d8e] via-[#e41e2b] to-[#005baa]" />

          <label className="block text-left text-[10px] uppercase tracking-widest font-medium mb-2 mt-2 fids-font" style={{ color: 'var(--ink-muted)' }}>
            Flight Code
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
            <svg width="20" height="20" viewBox="0 0 64 64" fill="currentColor" className="takeoff-icon transition-transform duration-200">
              <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
            </svg>
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs" style={{ color: 'var(--ink-muted)' }}>
          Organizer?{' '}
          <button onClick={() => router.push(userId ? '/dashboard' : '/login')} className="font-semibold underline underline-offset-2" style={{ color: 'var(--amber)' }}>
            {userId ? 'Control Tower' : 'Crew Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
