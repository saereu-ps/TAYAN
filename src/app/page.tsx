'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle } from './theme-provider';

function PlaneIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 32L56 8L40 56L30 36L4 32Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M30 36L56 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <path d="M30 36V50L38 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BangkokSkylineBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
        {/* Chao Phraya River */}
        <path d="M0 650 Q200 630 400 660 Q600 690 800 655 Q1000 620 1200 650 L1200 800 L0 800Z" stroke="currentColor" strokeWidth="0.5" opacity="0.08" fill="none"/>
        <path d="M0 670 Q300 650 500 680 Q700 710 900 675 Q1100 640 1200 670" stroke="currentColor" strokeWidth="0.3" opacity="0.06" fill="none"/>
        <path d="M0 685 Q250 670 450 695 Q650 720 850 690 Q1050 660 1200 685" stroke="currentColor" strokeWidth="0.3" opacity="0.04" fill="none"/>

        {/* Wat Arun silhouette */}
        <g opacity="0.1" stroke="currentColor" strokeWidth="0.8" fill="none">
          <path d="M280 650 L280 520 L290 480 L295 440 L300 400 L300 380 L300 360 L298 340 L300 320 L302 340 L300 360 L300 380 L300 400 L305 440 L310 480 L320 520 L320 650"/>
          <path d="M260 650 L265 560 L275 530 L280 520"/>
          <path d="M320 520 L325 530 L335 560 L340 650"/>
          {/* Prang tiers */}
          <path d="M285 480 L315 480"/>
          <path d="M288 440 L312 440"/>
          <path d="M293 400 L307 400"/>
          {/* Small prangs */}
          <path d="M230 650 L230 580 L235 560 L237 545 L235 560 L240 580 L240 650"/>
          <path d="M360 650 L360 580 L365 560 L367 545 L365 560 L370 580 L370 650"/>
        </g>

        {/* Temple spires scattered */}
        <g opacity="0.07" stroke="currentColor" strokeWidth="0.6" fill="none">
          <path d="M600 650 L600 580 L605 550 L607 530 L605 550 L610 580 L610 650"/>
          <path d="M595 580 L615 580"/>
          <path d="M800 650 L800 590 L803 570 L805 555 L803 570 L806 590 L806 650"/>
          <path d="M150 650 L150 600 L153 585 L155 575 L153 585 L156 600 L156 650"/>
        </g>

        {/* Tuk-tuk outline */}
        <g opacity="0.06" stroke="currentColor" strokeWidth="0.6" fill="none" transform="translate(900, 620)">
          <path d="M0 30 L5 10 L25 5 L40 5 L45 10 L50 10 L55 15 L55 25 L50 30"/>
          <circle cx="12" cy="30" r="5"/>
          <circle cx="45" cy="30" r="5"/>
          <path d="M25 5 L25 15 L40 15 L40 5"/>
        </g>

        {/* Floating paper planes */}
        <g opacity="0.06" stroke="currentColor" strokeWidth="0.5" fill="none">
          <path d="M100 200 L130 190 L120 210 L112 202 L100 200Z" />
          <path d="M500 150 L530 140 L520 160 L512 152 L500 150Z" />
          <path d="M900 250 L930 240 L920 260 L912 252 L900 250Z" />
          <path d="M700 100 L720 95 L715 108 L710 103 L700 100Z" />
          <path d="M200 350 L220 345 L215 358 L210 353 L200 350Z" />
          <path d="M1050 180 L1070 175 L1065 188 L1060 183 L1050 180Z" />
        </g>

        {/* Modern buildings (Bangkok skyline) */}
        <g opacity="0.05" stroke="currentColor" strokeWidth="0.5" fill="none">
          <rect x="450" y="550" width="20" height="100" rx="1"/>
          <rect x="480" y="520" width="15" height="130" rx="1"/>
          <rect x="510" y="540" width="25" height="110" rx="1"/>
          <rect x="680" y="560" width="18" height="90" rx="1"/>
          <rect x="710" y="530" width="22" height="120" rx="1"/>
          <rect x="1000" y="550" width="20" height="100" rx="1"/>
          <rect x="1030" y="570" width="15" height="80" rx="1"/>
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
      <BangkokSkylineBg />
      <ThemeToggle />

      {/* Ambient glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--amber-glow) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--teal-glow) 0%, transparent 70%)' }} />

      {/* Floating planes */}
      {[
        { x: '8%', y: '18%', size: 32, delay: 0 },
        { x: '82%', y: '12%', size: 24, delay: 2 },
        { x: '72%', y: '68%', size: 28, delay: 4 },
        { x: '12%', y: '72%', size: 20, delay: 1 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none z-0"
          style={{ left: p.x, top: p.y, color: 'var(--amber)', opacity: 0.12 }}
          animate={{ y: [0, -15, 0], x: [0, 10, 0], rotate: [0, 5, -3, 0] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        >
          <PlaneIcon size={p.size} />
        </motion.div>
      ))}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-sm text-center"
      >
        {/* Hero plane */}
        <motion.div
          className="mb-8 inline-block"
          style={{ color: 'var(--amber)' }}
          animate={{ y: [0, -8, 0], rotate: [0, 2, -1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <PlaneIcon size={88} />
        </motion.div>

        <h1 className="heading text-3xl font-bold mb-2">
          Paper Plane
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--ink-muted)' }}>
          Send your thoughts, carried by the wind
        </p>

        {/* Card */}
        <div className="card">
          <label className="block text-left text-xs font-medium mb-2" style={{ color: 'var(--ink-muted)' }}>
            Room Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="input-zen text-center text-xl font-bold tracking-[0.3em]"
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          />
          <button
            onClick={handleJoin}
            disabled={code.length !== 6}
            className="btn-primary w-full mt-4"
          >
            Join Room
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs" style={{ color: 'var(--ink-muted)' }}>
          Organizer?{' '}
          <button onClick={() => router.push(userId ? '/dashboard' : '/login')} className="font-semibold underline underline-offset-2" style={{ color: 'var(--amber)' }}>
            {userId ? 'Dashboard' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
