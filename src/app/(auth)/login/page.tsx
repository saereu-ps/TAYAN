'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle } from '../../theme-provider';

function PlaneIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 32L56 8L40 56L30 36L4 32Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M30 36L56 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <path d="M30 36V50L38 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ThaiCanalBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
        {/* Canal water */}
        <g opacity="0.06" stroke="currentColor" fill="none">
          <path d="M0 600 Q200 580 400 610 Q600 640 800 605 Q1000 570 1200 600 L1200 800 L0 800Z" strokeWidth="0.5"/>
          <path d="M0 620 Q300 600 500 630 Q700 660 900 625 Q1100 590 1200 620" strokeWidth="0.3"/>
          <path d="M0 640 Q250 625 450 650 Q650 675 850 645 Q1050 615 1200 640" strokeWidth="0.2"/>
        </g>

        {/* Longtail boat */}
        <g opacity="0.07" stroke="currentColor" strokeWidth="0.6" fill="none" transform="translate(500, 570)">
          <path d="M0 20 Q20 15 60 12 Q100 8 140 6 Q160 5 180 8 L200 12"/>
          <path d="M0 20 Q20 25 60 27 Q100 28 140 26 Q160 24 180 22 L200 12"/>
          {/* Long tail engine */}
          <path d="M200 12 L240 5 L250 8"/>
          <line x1="240" y1="5" x2="260" y2="3"/>
          {/* Canopy */}
          <path d="M60 12 L60 -5 Q90 -12 120 -5 L120 8"/>
          {/* Person */}
          <circle cx="180" cy="5" r="3"/>
          <path d="M180 8 L180 16"/>
        </g>

        {/* Stilted houses left */}
        <g opacity="0.05" stroke="currentColor" strokeWidth="0.5" fill="none" transform="translate(100, 480)">
          <rect x="0" y="0" width="60" height="40" rx="1"/>
          <path d="M-5 0 L30 -15 L65 0"/>
          <line x1="10" y1="40" x2="10" y2="70"/>
          <line x1="50" y1="40" x2="50" y2="70"/>
          <rect x="20" y="10" width="12" height="15" rx="1"/>
          <rect x="38" y="10" width="12" height="15" rx="1"/>
        </g>

        {/* Stilted houses right */}
        <g opacity="0.05" stroke="currentColor" strokeWidth="0.5" fill="none" transform="translate(900, 470)">
          <rect x="0" y="0" width="70" height="45" rx="1"/>
          <path d="M-5 0 L35 -18 L75 0"/>
          <line x1="12" y1="45" x2="12" y2="75"/>
          <line x1="58" y1="45" x2="58" y2="75"/>
          <rect x="15" y="12" width="14" height="18" rx="1"/>
          <rect x="40" y="12" width="14" height="18" rx="1"/>
        </g>

        {/* Coconut palms */}
        <g opacity="0.06" stroke="currentColor" strokeWidth="0.5" fill="none">
          {/* Palm 1 */}
          <path d="M80 480 Q85 420 90 380 Q92 360 88 340"/>
          <path d="M88 340 Q80 320 65 325"/>
          <path d="M88 340 Q95 320 110 322"/>
          <path d="M88 340 Q82 325 75 335"/>
          <path d="M88 340 Q94 325 102 333"/>
          <path d="M88 340 Q88 320 88 310"/>

          {/* Palm 2 */}
          <path d="M1050 470 Q1055 410 1058 370 Q1060 350 1055 330"/>
          <path d="M1055 330 Q1047 310 1035 315"/>
          <path d="M1055 330 Q1063 310 1075 312"/>
          <path d="M1055 330 Q1049 315 1042 325"/>
          <path d="M1055 330 Q1061 315 1068 323"/>
        </g>

        {/* Small floating plants */}
        <g opacity="0.04" stroke="currentColor" strokeWidth="0.3" fill="none">
          <circle cx="350" cy="630" r="4"/>
          <circle cx="355" cy="628" r="3"/>
          <circle cx="700" cy="620" r="3"/>
          <circle cx="705" cy="618" r="4"/>
          <circle cx="850" cy="640" r="3"/>
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
      <ThaiCanalBg />
      <ThemeToggle />

      {/* Ambient glow */}
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--amber-glow) 0%, transparent 70%)' }} />

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
            style={{ color: 'var(--amber)' }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PlaneIcon size={48} />
          </motion.div>
          <h1 className="heading text-2xl font-semibold">
            Welcome
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--ink-muted)' }}>Enter your name to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card">
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--ink-muted)' }}>Your Name</label>
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
            className="btn-primary w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Entering...' : 'Enter'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-xs transition-opacity hover:opacity-80"
            style={{ color: 'var(--ink-muted)' }}
          >
            Back to home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
