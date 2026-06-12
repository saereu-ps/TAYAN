'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle } from '../../theme-provider';

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

function CheckInBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
        {/* Check-in counters */}
        <g opacity="0.12" stroke="currentColor" fill="none" strokeWidth="1">
          {/* Counter row */}
          <rect x="100" y="500" width="120" height="80" rx="3" fill="rgba(90,154,207,0.08)"/>
          <rect x="250" y="500" width="120" height="80" rx="3" fill="rgba(90,154,207,0.08)"/>
          <rect x="400" y="500" width="120" height="80" rx="3" fill="rgba(90,154,207,0.08)"/>
          <rect x="680" y="500" width="120" height="80" rx="3" fill="rgba(90,154,207,0.08)"/>
          <rect x="830" y="500" width="120" height="80" rx="3" fill="rgba(90,154,207,0.08)"/>
          <rect x="980" y="500" width="120" height="80" rx="3" fill="rgba(90,154,207,0.08)"/>

          {/* Counter screens */}
          <rect x="130" y="510" width="60" height="35" rx="2" fill="rgba(232,200,64,0.1)"/>
          <rect x="280" y="510" width="60" height="35" rx="2" fill="rgba(232,200,64,0.1)"/>
          <rect x="430" y="510" width="60" height="35" rx="2" fill="rgba(232,200,64,0.1)"/>
          <rect x="710" y="510" width="60" height="35" rx="2" fill="rgba(232,200,64,0.1)"/>
          <rect x="860" y="510" width="60" height="35" rx="2" fill="rgba(232,200,64,0.1)"/>
          <rect x="1010" y="510" width="60" height="35" rx="2" fill="rgba(232,200,64,0.1)"/>
        </g>

        {/* Departure board above */}
        <g opacity="0.15" stroke="currentColor" fill="none" strokeWidth="0.8">
          <rect x="350" y="100" width="500" height="60" rx="4" fill="rgba(15,18,25,0.05)"/>
          {/* Board rows */}
          <line x1="360" y1="120" x2="840" y2="120" strokeWidth="0.3"/>
          <line x1="360" y1="135" x2="840" y2="135" strokeWidth="0.3"/>
          <line x1="360" y1="150" x2="840" y2="150" strokeWidth="0.3"/>
          {/* Column dividers */}
          <line x1="450" y1="105" x2="450" y2="155" strokeWidth="0.3"/>
          <line x1="580" y1="105" x2="580" y2="155" strokeWidth="0.3"/>
          <line x1="700" y1="105" x2="700" y2="155" strokeWidth="0.3"/>
        </g>

        {/* Rope barriers (queue lines) */}
        <g opacity="0.06" stroke="currentColor" strokeWidth="0.8" fill="none">
          <line x1="200" y1="450" x2="200" y2="480"/>
          <circle cx="200" cy="448" r="3"/>
          <line x1="350" y1="450" x2="350" y2="480"/>
          <circle cx="350" cy="448" r="3"/>
          <line x1="500" y1="450" x2="500" y2="480"/>
          <circle cx="500" cy="448" r="3"/>
          <path d="M200 460 Q275 470 350 460" strokeDasharray="4 3"/>
          <path d="M350 460 Q425 470 500 460" strokeDasharray="4 3"/>
        </g>

        {/* Ceiling structure */}
        <g opacity="0.04" stroke="currentColor" strokeWidth="0.5">
          <line x1="0" y1="50" x2="1200" y2="50"/>
          <line x1="150" y1="0" x2="150" y2="50"/>
          <line x1="400" y1="0" x2="400" y2="50"/>
          <line x1="600" y1="0" x2="600" y2="50"/>
          <line x1="800" y1="0" x2="800" y2="50"/>
          <line x1="1050" y1="0" x2="1050" y2="50"/>
        </g>
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
      <CheckInBg />
      <ThemeToggle />

      {/* Ambient glow */}
      <div className="absolute top-[-10%] left-[30%] w-[40%] h-[40%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--amber-glow) 0%, transparent 70%)' }} />

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
            style={{ color: 'var(--blue)' }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AirplaneIcon size={56} />
          </motion.div>
          <h1 className="heading text-2xl font-semibold">
            Check In
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--ink-muted)' }}>Crew access — enter your name to proceed</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card relative overflow-hidden">
          {/* Airline stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4b2d8e] via-[#f58220] to-[#005baa]" />

          <label className="block text-[10px] uppercase tracking-widest font-medium mb-2 mt-2 fids-font" style={{ color: 'var(--ink-muted)' }}>Crew Name</label>
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
            <AirplaneIcon size={16} />
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-xs transition-opacity hover:opacity-80"
            style={{ color: 'var(--ink-muted)' }}
          >
            ← Back to terminal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
