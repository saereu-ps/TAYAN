'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ZenLandscape({ isNight }: { isNight: boolean }) {
  const skyColor = isNight ? '#0f0f2a' : '#f5f0e4';
  const mountainColor = isNight ? '#1a1a3e' : '#d4c9b8';
  const mountainFar = isNight ? '#252550' : '#e0d6c6';
  const streamColor = isNight ? '#3a3a6e' : '#c8d8e0';
  const cloudColor = isNight ? '#2a2a5a' : '#fff9f0';

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <rect width="1440" height="900" fill={skyColor} />
      {/* Far mountains */}
      <path d="M0 600 Q200 350 400 500 Q600 300 800 480 Q1000 320 1200 450 Q1350 380 1440 500 L1440 900 L0 900Z" fill={mountainFar} opacity="0.5" />
      {/* Near mountains */}
      <path d="M0 650 Q150 450 350 580 Q550 400 750 550 Q950 420 1150 520 Q1300 450 1440 580 L1440 900 L0 900Z" fill={mountainColor} opacity="0.7" />
      {/* Stream */}
      <path d="M600 900 Q650 800 620 720 Q680 650 660 600 Q700 550 680 500" fill="none" stroke={streamColor} strokeWidth="3" opacity="0.6" />
      <path d="M610 900 Q660 800 630 720 Q690 650 670 600 Q710 550 690 500" fill="none" stroke={streamColor} strokeWidth="2" opacity="0.4" />
      {/* Clouds */}
      <ellipse cx="200" cy="200" rx="80" ry="30" fill={cloudColor} opacity="0.5" />
      <ellipse cx="900" cy="150" rx="100" ry="35" fill={cloudColor} opacity="0.4" />
      <ellipse cx="1200" cy="250" rx="70" ry="25" fill={cloudColor} opacity="0.3" />
      {/* Flying paper planes */}
      <g opacity="0.4">
        <path d="M300 280 L320 275 L310 285 Z" fill={isNight ? '#e07a5a' : '#c05a3a'} />
        <path d="M800 200 L825 193 L812 205 Z" fill={isNight ? '#e07a5a' : '#c05a3a'} />
        <path d="M1100 300 L1120 295 L1110 308 Z" fill={isNight ? '#e07a5a' : '#c05a3a'} />
      </g>
      {/* Moon (night only) */}
      {isNight && <circle cx="1200" cy="120" r="40" fill="#f5f0e4" opacity="0.8" />}
    </svg>
  );
}

function PaperPlaneIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

export default function LandingPage() {
  const [code, setCode] = useState('');
  const [isNight, setIsNight] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { userId } = useUserStore();

  const joinMutation = trpc.room.getByCode.useQuery(
    { code: code.toUpperCase() },
    { enabled: false },
  );

  const handleJoinRoom = async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-character room code');
      return;
    }
    setError('');
    router.push(`/room/${code.toUpperCase()}`);
  };

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-center ${isNight ? 'night-mode' : ''}`}>
      <ZenLandscape isNight={isNight} />

      {/* Day/Night toggle */}
      <button
        onClick={() => setIsNight(!isNight)}
        className="absolute top-6 right-6 z-20 p-3 rounded-full transition-all duration-300"
        style={{ 
          backgroundColor: isNight ? 'rgba(245, 240, 228, 0.1)' : 'rgba(42, 58, 74, 0.1)',
          color: isNight ? '#e8e0d4' : '#2a3a4a'
        }}
      >
        {isNight ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
          style={{ color: isNight ? '#e07a5a' : '#c05a3a' }}
        >
          <PaperPlaneIcon />
        </motion.div>

        <h1
          className="text-3xl font-medium mb-2 tracking-wide"
          style={{ color: isNight ? '#e8e0d4' : '#2a3a4a' }}
        >
          Paper Plane
        </h1>
        <p
          className="text-sm mb-8 opacity-70"
          style={{ color: isNight ? '#e8e0d4' : '#2a3a4a' }}
        >
          Send your thoughts, carried by the wind
        </p>

        {/* Join Room Card */}
        <div
          className="w-full rounded-xl p-6 backdrop-blur-sm"
          style={{
            backgroundColor: isNight ? 'rgba(31, 31, 58, 0.9)' : 'rgba(250, 248, 243, 0.9)',
            border: `1px solid ${isNight ? '#2a2a4e' : '#e8e0d4'}`,
          }}
        >
          <label
            className="block text-xs font-medium mb-2 text-left opacity-70"
            style={{ color: isNight ? '#e8e0d4' : '#2a3a4a' }}
          >
            Enter Room Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="ABC123"
            maxLength={6}
            className="input-zen text-center text-xl tracking-[0.3em] font-medium mb-4"
            style={{
              backgroundColor: isNight ? 'rgba(26, 26, 46, 0.8)' : undefined,
              borderColor: isNight ? '#2a2a4e' : undefined,
              color: isNight ? '#e8e0d4' : undefined,
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
          />
          {error && (
            <p className="text-xs mb-3" style={{ color: '#c05a3a' }}>
              {error}
            </p>
          )}
          <button onClick={handleJoinRoom} className="btn-vermillion w-full">
            Join Room
          </button>
        </div>

        {/* Admin link */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push(userId ? '/dashboard' : '/login')}
            className="text-sm opacity-60 hover:opacity-100 transition-opacity underline underline-offset-4"
            style={{ color: isNight ? '#e8e0d4' : '#2a3a4a' }}
          >
            {userId ? 'Dashboard' : 'Admin Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
