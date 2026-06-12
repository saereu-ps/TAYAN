'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle, useTheme } from './theme-provider';

function AirplaneIcon({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Fuselage */}
      <path d="M20 48 Q30 38 60 36 L170 36 Q185 36 192 42 Q198 48 192 54 Q185 60 170 60 L60 60 Q30 58 20 48Z" fill="#f0ebe0"/>
      {/* Belly shadow */}
      <path d="M30 52 Q60 62 120 62 Q160 62 185 56 Q190 54 188 52 L170 60 L60 60 Q35 58 30 52Z" fill="#d4d0c8" opacity="0.5"/>
      {/* Thai-inspired purple cheatline */}
      <path d="M40 46 L180 46 L180 48 L40 48Z" fill="#4b2d8e"/>
      {/* Gold accent line below */}
      <path d="M40 48 L180 48 L180 49 L40 49Z" fill="#c4a44e"/>
      {/* Tail fin */}
      <path d="M28 48 L20 20 L40 22 L42 40Z" fill="#4b2d8e"/>
      {/* Tail gold stripe */}
      <path d="M24 30 L36 32 L36 34 L25 33Z" fill="#c4a44e"/>
      {/* Horizontal stabilizer */}
      <path d="M22 46 L10 38 L18 37 L30 44Z" fill="#d8d4cc"/>
      <path d="M22 50 L10 58 L18 59 L30 52Z" fill="#d8d4cc"/>
      {/* Wing */}
      <path d="M80 55 L65 88 L130 88 L115 55Z" fill="#c8c4bc"/>
      {/* Wing top surface */}
      <path d="M80 52 L68 80 L125 80 L112 52Z" fill="#d8d4cc"/>
      {/* Engine 1 */}
      <ellipse cx="88" cy="82" rx="7" ry="5" fill="#8a8680"/>
      <ellipse cx="88" cy="82" rx="4.5" ry="3" fill="#3a3a3a"/>
      {/* Engine 2 */}
      <ellipse cx="112" cy="82" rx="7" ry="5" fill="#8a8680"/>
      <ellipse cx="112" cy="82" rx="4.5" ry="3" fill="#3a3a3a"/>
      {/* Cockpit windows */}
      <path d="M182 40 Q190 44 190 48 Q190 52 182 56" fill="#5a9ad5" opacity="0.7"/>
      <path d="M183 42 Q188 45 188 48 Q188 51 183 54" fill="#3a7ab5" opacity="0.5"/>
      {/* Passenger windows */}
      <g fill="#5b9bd5" opacity="0.6">
        <rect x="55" y="42" width="3" height="5" rx="1.5"/>
        <rect x="62" y="42" width="3" height="5" rx="1.5"/>
        <rect x="69" y="42" width="3" height="5" rx="1.5"/>
        <rect x="76" y="42" width="3" height="5" rx="1.5"/>
        <rect x="83" y="42" width="3" height="5" rx="1.5"/>
        <rect x="90" y="42" width="3" height="5" rx="1.5"/>
        <rect x="97" y="42" width="3" height="5" rx="1.5"/>
        <rect x="104" y="42" width="3" height="5" rx="1.5"/>
        <rect x="111" y="42" width="3" height="5" rx="1.5"/>
        <rect x="118" y="42" width="3" height="5" rx="1.5"/>
        <rect x="125" y="42" width="3" height="5" rx="1.5"/>
        <rect x="132" y="42" width="3" height="5" rx="1.5"/>
        <rect x="139" y="42" width="3" height="5" rx="1.5"/>
        <rect x="146" y="42" width="3" height="5" rx="1.5"/>
        <rect x="153" y="42" width="3" height="5" rx="1.5"/>
        <rect x="160" y="42" width="3" height="5" rx="1.5"/>
        <rect x="167" y="42" width="3" height="5" rx="1.5"/>
      </g>
      {/* Door lines */}
      <line x1="52" y1="37" x2="52" y2="59" stroke="#b8b4ac" strokeWidth="0.5"/>
      <line x1="100" y1="37" x2="100" y2="59" stroke="#b8b4ac" strokeWidth="0.5"/>
      <line x1="150" y1="37" x2="150" y2="59" stroke="#b8b4ac" strokeWidth="0.5"/>
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
  const { theme } = useTheme();
  const isNight = theme === 'night';

  const skyColor = isNight ? '#1a2040' : '#5b9bd5';
  const cloudColor = isNight ? '#2a3a5a' : '#f5e8c8';
  const cloudHighlight = isNight ? '#3a4a6a' : '#fff8e8';
  const bottomCloud1 = isNight ? '#3a2040' : '#e89050';
  const bottomCloud2 = isNight ? '#2a1a30' : '#e87060';
  const contrailColor = isNight ? '#4a5a7a' : '#f5e0b0';
  const plumColor = isNight ? '#2a1a30' : '#5a3050';

  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
        <rect width="1200" height="800" fill={skyColor}/>

        {/* Stars (night only) */}
        {isNight && (
          <g>
            <circle cx="100" cy="80" r="1.5" fill="#ffffff" opacity="0.6"/>
            <circle cx="250" cy="50" r="1" fill="#ffffff" opacity="0.4"/>
            <circle cx="400" cy="120" r="2" fill="#ffffff" opacity="0.5"/>
            <circle cx="550" cy="60" r="1.5" fill="#ffffff" opacity="0.3"/>
            <circle cx="700" cy="90" r="1" fill="#ffffff" opacity="0.7"/>
            <circle cx="850" cy="40" r="2" fill="#ffffff" opacity="0.4"/>
            <circle cx="1000" cy="100" r="1.5" fill="#ffffff" opacity="0.5"/>
            <circle cx="1100" cy="70" r="1" fill="#ffffff" opacity="0.6"/>
            <circle cx="150" cy="200" r="1" fill="#ffffff" opacity="0.3"/>
            <circle cx="350" cy="250" r="2" fill="#ffffff" opacity="0.4"/>
            <circle cx="500" cy="180" r="1.5" fill="#ffffff" opacity="0.5"/>
            <circle cx="750" cy="220" r="1" fill="#ffffff" opacity="0.6"/>
            <circle cx="900" cy="160" r="2" fill="#ffffff" opacity="0.3"/>
            <circle cx="1050" cy="240" r="1.5" fill="#ffffff" opacity="0.5"/>
            <circle cx="200" cy="320" r="1" fill="#ffffff" opacity="0.4"/>
            <circle cx="450" cy="350" r="1.5" fill="#ffffff" opacity="0.3"/>
            <circle cx="650" cy="300" r="2" fill="#ffffff" opacity="0.5"/>
            <circle cx="950" cy="320" r="1" fill="#ffffff" opacity="0.4"/>
            <circle cx="1150" cy="150" r="1.5" fill="#ffffff" opacity="0.6"/>
            <circle cx="80" cy="400" r="1" fill="#ffffff" opacity="0.3"/>
          </g>
        )}

        {/* Sun (day) or Moon (night) */}
        {isNight ? (
          <g>
            {/* Crescent moon */}
            <circle cx="600" cy="720" r="280" fill="#f0e8d0" opacity="0.15"/>
            <circle cx="600" cy="720" r="200" fill="#f0e8d0" opacity="0.08"/>
            <path d="M580 440 A80 80 0 1 1 580 600 A60 60 0 1 0 580 440Z" fill="#f0e8d0" opacity="0.9"/>
          </g>
        ) : (
          <g>
            <circle cx="600" cy="720" r="380" fill="#f0e8a0" opacity="0.9"/>
            <circle cx="600" cy="720" r="320" fill="#f0e8a0" opacity="0.5"/>
          </g>
        )}

        {/* Cream clouds top */}
        <ellipse cx="180" cy="140" rx="60" ry="30" fill={cloudColor}/>
        <ellipse cx="220" cy="130" rx="50" ry="28" fill={cloudColor}/>
        <ellipse cx="150" cy="148" rx="45" ry="22" fill={cloudColor}/>
        <ellipse cx="200" cy="120" rx="35" ry="20" fill={cloudHighlight}/>

        <ellipse cx="550" cy="100" rx="70" ry="32" fill={cloudColor}/>
        <ellipse cx="600" cy="90" rx="55" ry="28" fill={cloudColor}/>
        <ellipse cx="520" cy="108" rx="45" ry="22" fill={cloudColor}/>
        <ellipse cx="570" cy="82" rx="38" ry="20" fill={cloudHighlight}/>

        <ellipse cx="920" cy="120" rx="65" ry="30" fill={cloudColor}/>
        <ellipse cx="960" cy="110" rx="50" ry="26" fill={cloudColor}/>
        <ellipse cx="890" cy="128" rx="40" ry="20" fill={cloudColor}/>
        <ellipse cx="940" cy="100" rx="32" ry="18" fill={cloudHighlight}/>

        {/* Bottom clouds */}
        <ellipse cx="250" cy="640" rx="280" ry="65" fill={bottomCloud1} opacity="0.8"/>
        <ellipse cx="800" cy="660" rx="320" ry="70" fill={bottomCloud2} opacity="0.75"/>
        <ellipse cx="550" cy="680" rx="400" ry="80" fill={bottomCloud2} opacity="0.6"/>
        <ellipse cx="100" cy="700" rx="200" ry="55" fill={bottomCloud1} opacity="0.7"/>
        <ellipse cx="1050" cy="690" rx="250" ry="60" fill={bottomCloud1} opacity="0.65"/>

        {/* Mountains at bottom */}
        <path d="M0 740 L120 680 L280 720 L420 660 L580 710 L720 650 L880 700 L1020 670 L1120 710 L1200 680 L1200 800 L0 800Z" fill={plumColor} opacity="0.9"/>
        <path d="M0 760 L180 740 L380 755 L520 730 L720 750 L920 735 L1060 755 L1200 740 L1200 800 L0 800Z" fill={plumColor}/>

        {/* Contrail streaks */}
        <line x1="80" y1="310" x2="680" y2="270" stroke={contrailColor} strokeWidth="5" opacity="0.6" strokeLinecap="round"/>
        <line x1="120" y1="324" x2="640" y2="287" stroke={contrailColor} strokeWidth="3" opacity="0.35" strokeLinecap="round"/>
        <line x1="720" y1="340" x2="1140" y2="300" stroke={contrailColor} strokeWidth="4" opacity="0.5" strokeLinecap="round"/>

        {/* Large airplane flying diagonally */}
        <g transform="translate(650, 250) rotate(-6)">
          <path d="M20 48 Q30 38 60 36 L170 36 Q185 36 192 42 Q198 48 192 54 Q185 60 170 60 L60 60 Q30 58 20 48Z" fill="#f0ebe0"/>
          <path d="M30 52 Q60 62 120 62 Q160 62 185 56 Q190 54 188 52 L170 60 L60 60 Q35 58 30 52Z" fill="#d4d0c8" opacity="0.5"/>
          <path d="M40 46 L180 46 L180 48 L40 48Z" fill="#4b2d8e"/>
          <path d="M40 48 L180 48 L180 49 L40 49Z" fill="#c4a44e"/>
          <path d="M28 48 L20 20 L40 22 L42 40Z" fill="#4b2d8e"/>
          <path d="M24 30 L36 32 L36 34 L25 33Z" fill="#c4a44e"/>
          <path d="M22 46 L10 38 L18 37 L30 44Z" fill="#d8d4cc"/>
          <path d="M22 50 L10 58 L18 59 L30 52Z" fill="#d8d4cc"/>
          <path d="M80 55 L65 88 L130 88 L115 55Z" fill="#c8c4bc"/>
          <path d="M80 52 L68 80 L125 80 L112 52Z" fill="#d8d4cc"/>
          <ellipse cx="88" cy="82" rx="7" ry="5" fill="#8a8680"/>
          <ellipse cx="88" cy="82" rx="4.5" ry="3" fill="#3a3a3a"/>
          <ellipse cx="112" cy="82" rx="7" ry="5" fill="#8a8680"/>
          <ellipse cx="112" cy="82" rx="4.5" ry="3" fill="#3a3a3a"/>
          <path d="M182 40 Q190 44 190 48 Q190 52 182 56" fill="#5a9ad5" opacity="0.7"/>
          <g fill="#5b9bd5" opacity="0.6">
            <rect x="55" y="42" width="3" height="5" rx="1.5"/>
            <rect x="62" y="42" width="3" height="5" rx="1.5"/>
            <rect x="69" y="42" width="3" height="5" rx="1.5"/>
            <rect x="76" y="42" width="3" height="5" rx="1.5"/>
            <rect x="83" y="42" width="3" height="5" rx="1.5"/>
            <rect x="90" y="42" width="3" height="5" rx="1.5"/>
            <rect x="97" y="42" width="3" height="5" rx="1.5"/>
            <rect x="104" y="42" width="3" height="5" rx="1.5"/>
            <rect x="111" y="42" width="3" height="5" rx="1.5"/>
            <rect x="118" y="42" width="3" height="5" rx="1.5"/>
            <rect x="125" y="42" width="3" height="5" rx="1.5"/>
            <rect x="132" y="42" width="3" height="5" rx="1.5"/>
            <rect x="139" y="42" width="3" height="5" rx="1.5"/>
            <rect x="146" y="42" width="3" height="5" rx="1.5"/>
          </g>
          <line x1="52" y1="37" x2="52" y2="59" stroke="#b8b4ac" strokeWidth="0.5"/>
          <line x1="100" y1="37" x2="100" y2="59" stroke="#b8b4ac" strokeWidth="0.5"/>
          <line x1="150" y1="37" x2="150" y2="59" stroke="#b8b4ac" strokeWidth="0.5"/>
        </g>
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const [code, setCode] = useState('');
  const router = useRouter();
  const { userId } = useUserStore();
  const { theme } = useTheme();
  const isNight = theme === 'night';

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
          <AirplaneIcon size={160} />
        </motion.div>

        <h1
          className="heading text-5xl md:text-7xl font-black tracking-[0.15em] mb-2 text-white drop-shadow-md"
          style={{ textShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        >
          TAYAN
        </h1>
        <p className="text-base mb-10 text-white/80">
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
        <p className="mt-3 text-xs" style={{ color: isNight ? '#4a6080' : 'rgba(255,255,255,0.5)' }}>
          <button onClick={() => router.push('/contact')} className="underline underline-offset-2 hover:opacity-80 transition-opacity">
            Contact Developer
          </button>
        </p>
      </motion.div>
    </div>
  );
}
