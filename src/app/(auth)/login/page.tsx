'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle, useTheme } from '../../theme-provider';

function AirplaneIcon({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <path d="M183 42 Q188 45 188 48 Q188 51 183 54" fill="#3a7ab5" opacity="0.5"/>
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

function LoginBg() {
  const { theme } = useTheme();
  const isNight = theme === 'night';

  const skyColor = isNight ? '#1a2040' : '#5b9bd5';
  const cloudColor = isNight ? '#2a3a5a' : '#f5e8c8';
  const towerColor = isNight ? '#1a2a3a' : '#2a5a6a';
  const towerWindowColor = isNight ? '#2a3a5a' : '#5b9bd5';

  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
        <rect width="1200" height="800" fill={skyColor}/>

        {/* Stars (night only) */}
        {isNight && (
          <g>
            <circle cx="100" cy="80" r="1.5" fill="#ffffff" opacity="0.6"/>
            <circle cx="300" cy="50" r="1" fill="#ffffff" opacity="0.4"/>
            <circle cx="450" cy="130" r="2" fill="#ffffff" opacity="0.5"/>
            <circle cx="600" cy="60" r="1.5" fill="#ffffff" opacity="0.3"/>
            <circle cx="750" cy="90" r="1" fill="#ffffff" opacity="0.7"/>
            <circle cx="850" cy="200" r="2" fill="#ffffff" opacity="0.4"/>
            <circle cx="1050" cy="100" r="1.5" fill="#ffffff" opacity="0.5"/>
            <circle cx="1150" cy="180" r="1" fill="#ffffff" opacity="0.6"/>
            <circle cx="200" cy="250" r="1" fill="#ffffff" opacity="0.3"/>
            <circle cx="400" cy="300" r="1.5" fill="#ffffff" opacity="0.4"/>
            <circle cx="700" cy="250" r="2" fill="#ffffff" opacity="0.5"/>
            <circle cx="550" cy="350" r="1" fill="#ffffff" opacity="0.4"/>
          </g>
        )}

        {/* Sun (day) or Moon (night) */}
        {isNight ? (
          <g>
            <path d="M180 130 A60 60 0 1 1 180 250 A45 45 0 1 0 180 130Z" fill="#f0e8d0" opacity="0.9"/>
          </g>
        ) : (
          <g>
            <circle cx="200" cy="150" r="150" fill="#f0e8a0" opacity="0.8"/>
            <circle cx="200" cy="150" r="120" fill="#f0e8a0" opacity="0.4"/>
          </g>
        )}

        {/* Control tower silhouette */}
        <g fill={towerColor} opacity="0.6">
          <rect x="950" y="350" width="60" height="450" rx="4"/>
          <rect x="920" y="300" width="120" height="60" rx="6"/>
          <rect x="975" y="250" width="10" height="50"/>
          <circle cx="980" cy="245" r="8"/>
          <rect x="930" y="312" width="20" height="35" rx="3" fill={towerWindowColor} opacity="0.5"/>
          <rect x="958" y="312" width="20" height="35" rx="3" fill={towerWindowColor} opacity="0.5"/>
          <rect x="986" y="312" width="20" height="35" rx="3" fill={towerWindowColor} opacity="0.5"/>
          <rect x="1014" y="312" width="20" height="35" rx="3" fill={towerWindowColor} opacity="0.5"/>
          <rect x="910" y="355" width="140" height="5" rx="2"/>
        </g>

        {/* Small clouds */}
        <ellipse cx="500" cy="180" rx="60" ry="25" fill={cloudColor} opacity="0.5"/>
        <ellipse cx="540" cy="170" rx="45" ry="20" fill={cloudColor} opacity="0.4"/>
        <ellipse cx="780" cy="120" rx="50" ry="22" fill={cloudColor} opacity="0.4"/>
      </svg>
    </div>
  );
}

export default function LoginPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useUserStore();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      setUser(data.id, data.name);
      router.push('/dashboard');
    },
    onError: () => {
      setError('Something went wrong. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setError('');
    loginMutation.mutate({ name: name.trim() });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <LoginBg />
      <ThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-block mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AirplaneIcon size={100} />
          </motion.div>
          <h1 className="heading text-2xl font-semibold text-white drop-shadow-sm">
            Check In
          </h1>
          <p className="text-sm mt-2 text-white/70">Crew access -- enter your name to proceed</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card relative overflow-hidden">
          <label className="block text-[10px] uppercase tracking-widest font-medium mb-2 fids-font" style={{ color: 'var(--ink-muted)' }}>Crew Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="input-zen mb-4"
            autoFocus
          />
          {error && (
            <p className="text-xs mb-3" style={{ color: 'var(--error)' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            className="btn-takeoff w-full"
            disabled={loginMutation.isPending}
          >
            <span>{loginMutation.isPending ? 'Checking in...' : 'Check In'}</span>
            <SmallPlaneIcon size={16} />
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-xs transition-opacity hover:opacity-80 text-white/60"
          >
            Back to terminal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
