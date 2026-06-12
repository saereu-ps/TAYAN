'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';

function PlaneIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 32L56 8L40 56L30 36L4 32Z" />
      <path d="M30 36L56 8" />
      <path d="M30 36L30 50L38 42" />
    </svg>
  );
}

export default function LandingPage() {
  const [code, setCode] = useState('');
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const { userId } = useUserStore();

  const handleJoin = () => {
    if (code.length === 6) router.push(`/room/${code.toUpperCase()}`);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden ${isDark ? 'dark' : ''}`} style={{ background: isDark ? '#1a1d24' : '#f8f5f0' }}>
      {/* Ambient glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none" style={{ background: `radial-gradient(ellipse, ${isDark ? 'rgba(232,160,80,0.06)' : 'rgba(212,136,58,0.08)'} 0%, transparent 70%)` }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none" style={{ background: `radial-gradient(ellipse, ${isDark ? 'rgba(42,107,90,0.06)' : 'rgba(42,107,90,0.05)'} 0%, transparent 70%)` }} />

      {/* Floating planes background */}
      {[
        { x: '10%', y: '20%', size: 32, delay: 0 },
        { x: '80%', y: '15%', size: 24, delay: 2 },
        { x: '70%', y: '70%', size: 28, delay: 4 },
        { x: '15%', y: '75%', size: 20, delay: 1 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: p.x, top: p.y, color: isDark ? 'rgba(232,160,80,0.12)' : 'rgba(212,136,58,0.1)' }}
          animate={{ y: [0, -15, 0], x: [0, 10, 0], rotate: [0, 5, -3, 0] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        >
          <PlaneIcon size={p.size} />
        </motion.div>
      ))}

      {/* Day/Night toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{ border: `1px solid ${isDark ? '#333840' : '#eae5dc'}`, color: isDark ? '#f0ebe0' : '#1a1d24' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          {isDark
            ? <><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>
            : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          }
        </svg>
      </button>

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
          style={{ color: isDark ? '#e8a050' : '#d4883a' }}
          animate={{ y: [0, -8, 0], rotate: [0, 2, -1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <PlaneIcon size={88} />
        </motion.div>

        <h1 className="heading text-3xl font-bold mb-2" style={{ color: isDark ? '#f0ebe0' : '#1a1d24' }}>
          Paper Plane
        </h1>
        <p className="text-sm mb-10" style={{ color: isDark ? '#8a8580' : '#6b6860' }}>
          Send your thoughts, carried by the wind
        </p>

        {/* Card */}
        <div className="rounded-2xl p-7" style={{
          background: isDark ? '#252830' : '#ffffff',
          border: `1px solid ${isDark ? '#333840' : '#eae5dc'}`,
          boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 20px rgba(26,29,36,0.06)',
        }}>
          <label className="block text-left text-xs font-medium mb-2" style={{ color: isDark ? '#8a8580' : '#6b6860' }}>
            Room Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="w-full rounded-xl px-4 py-4 text-center text-xl font-bold tracking-[0.3em] outline-none transition-all"
            style={{
              background: isDark ? '#1a1d24' : '#f8f5f0',
              border: `1.5px solid ${isDark ? '#333840' : '#eae5dc'}`,
              color: isDark ? '#f0ebe0' : '#1a1d24',
            }}
            onFocus={(e) => e.target.style.borderColor = isDark ? '#e8a050' : '#d4883a'}
            onBlur={(e) => e.target.style.borderColor = isDark ? '#333840' : '#eae5dc'}
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
        <p className="mt-8 text-xs" style={{ color: isDark ? '#6b6860' : '#8a8580' }}>
          Organizer?{' '}
          <button onClick={() => router.push(userId ? '/dashboard' : '/login')} className="font-semibold underline underline-offset-2" style={{ color: isDark ? '#e8a050' : '#d4883a' }}>
            {userId ? 'Dashboard' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
