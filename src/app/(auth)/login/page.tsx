'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle } from '../../theme-provider';

function AirplaneIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="65" cy="28" rx="48" ry="9" fill="#f0ebe0"/>
      <path d="M17 28 C17 34 40 37 65 37 C90 37 113 34 113 28" fill="#2a5a6a" opacity="0.9"/>
      <path d="M50 32 L38 52 L82 52 L72 32Z" fill="#2a5a6a"/>
      <path d="M18 28 L10 12 L24 14 L22 28Z" fill="#2a5a6a"/>
      <path d="M18 22 L14 16 L22 17Z" fill="#f0ebe0"/>
      <ellipse cx="52" cy="44" rx="5" ry="3.5" fill="#3a6a7a"/>
      <ellipse cx="72" cy="44" rx="5" ry="3.5" fill="#3a6a7a"/>
      <g fill="#5b9bd5">
        <rect x="42" y="25" width="3" height="4" rx="1.5"/>
        <rect x="56" y="25" width="3" height="4" rx="1.5"/>
        <rect x="70" y="25" width="3" height="4" rx="1.5"/>
        <rect x="84" y="25" width="3" height="4" rx="1.5"/>
      </g>
      <path d="M108 24 Q113 28 108 32" fill="#4a9aba" opacity="0.8"/>
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

function LoginBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
        {/* Sky blue base */}
        <rect width="1200" height="800" fill="#5b9bd5"/>

        {/* Sun circle — top left, smaller */}
        <circle cx="200" cy="150" r="150" fill="#f0e8a0" opacity="0.8"/>
        <circle cx="200" cy="150" r="120" fill="#f0e8a0" opacity="0.4"/>

        {/* Control tower silhouette — right side, dark teal filled */}
        <g fill="#2a5a6a" opacity="0.6">
          {/* Tower base */}
          <rect x="950" y="350" width="60" height="450" rx="4"/>
          {/* Tower cabin */}
          <rect x="920" y="300" width="120" height="60" rx="6"/>
          {/* Tower top/antenna */}
          <rect x="975" y="250" width="10" height="50"/>
          <circle cx="980" cy="245" r="8"/>
          {/* Windows on cabin */}
          <rect x="930" y="312" width="20" height="35" rx="3" fill="#5b9bd5" opacity="0.5"/>
          <rect x="958" y="312" width="20" height="35" rx="3" fill="#5b9bd5" opacity="0.5"/>
          <rect x="986" y="312" width="20" height="35" rx="3" fill="#5b9bd5" opacity="0.5"/>
          <rect x="1014" y="312" width="20" height="35" rx="3" fill="#5b9bd5" opacity="0.5"/>
          {/* Platform/balcony */}
          <rect x="910" y="355" width="140" height="5" rx="2"/>
        </g>

        {/* Small clouds */}
        <ellipse cx="500" cy="180" rx="60" ry="25" fill="#f5e8c8" opacity="0.5"/>
        <ellipse cx="540" cy="170" rx="45" ry="20" fill="#f5e8c8" opacity="0.4"/>
        <ellipse cx="780" cy="120" rx="50" ry="22" fill="#f5e8c8" opacity="0.4"/>
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
            <AirplaneIcon size={64} />
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
