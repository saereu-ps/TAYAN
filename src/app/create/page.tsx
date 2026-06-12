'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle } from '../theme-provider';

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

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function CreateBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        {/* Sky blue */}
        <rect width="1200" height="800" fill="#5b9bd5"/>

        {/* 3-4 scattered airplane silhouettes in dark teal at various angles/sizes */}
        <g fill="#2a5a6a">
          {/* Top-left, medium, tilted left */}
          <g transform="translate(150, 120) scale(0.6) rotate(-15)" opacity="0.3">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
          {/* Top-right, small, tilted right */}
          <g transform="translate(950, 100) scale(0.4) rotate(12)" opacity="0.25">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
          {/* Bottom-left, large, slight tilt */}
          <g transform="translate(100, 600) scale(0.7) rotate(-8)" opacity="0.2">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
          {/* Right middle, medium */}
          <g transform="translate(1020, 450) scale(0.5) rotate(20)" opacity="0.22">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
        </g>

        {/* Light contrail streaks */}
        <line x1="100" y1="160" x2="350" y2="140" stroke="#f5e0b0" strokeWidth="3" opacity="0.3" strokeLinecap="round"/>
        <line x1="850" y1="130" x2="1100" y2="110" stroke="#f5e0b0" strokeWidth="2" opacity="0.25" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export default function CreateRoomPage() {
  const [name, setName] = useState('');
  const [identityMode, setIdentityMode] = useState<'anonymous' | 'identified'>('anonymous');
  const [error, setError] = useState('');
  const router = useRouter();
  const { userId } = useUserStore();

  useEffect(() => {
    if (!userId) router.push('/login');
  }, [userId, router]);

  const createMutation = trpc.room.create.useMutation({
    onSuccess: (room) => {
      router.push(`/admin/${room.id}`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Destination name is required');
      return;
    }
    if (!userId) return;
    setError('');
    createMutation.mutate({
      name: name.trim(),
      identityMode,
      ownerId: userId,
    });
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen px-6 py-8 relative overflow-hidden">
      <CreateBg />
      <ThemeToggle />

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-80 text-white/70"
        >
          <BackIcon /> Back to flight schedule
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <h1 className="heading text-xl font-semibold text-white drop-shadow-sm">Schedule Flight</h1>
            <motion.div
              style={{ color: 'var(--cream)' }}
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <SmallPlaneIcon size={22} />
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="card relative overflow-hidden space-y-5">
            {/* Destination (Room Name) */}
            <div>
              <label className="block fids-font text-[10px] uppercase tracking-widest font-medium mb-2" style={{ color: 'var(--ink-muted)' }}>Destination</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Team Standup Q&A"
                className="input-zen"
                autoFocus
              />
              <p className="text-[10px] mt-1.5" style={{ color: 'var(--ink-muted)' }}>
                This is the room name passengers will see
              </p>
            </div>

            {/* Flight Type (Identity Mode) */}
            <div>
              <label className="block fids-font text-[10px] uppercase tracking-widest font-medium mb-3" style={{ color: 'var(--ink-muted)' }}>Flight Type</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIdentityMode('anonymous')}
                  className="flex-1 p-4 rounded-xl text-center transition-all border-2"
                  style={{
                    background: identityMode === 'anonymous' ? 'rgba(42,90,106,0.1)' : 'transparent',
                    borderColor: identityMode === 'anonymous' ? 'var(--teal)' : 'var(--border)',
                    color: identityMode === 'anonymous' ? 'var(--teal)' : 'var(--ink)',
                  }}
                >
                  <p className="text-sm font-semibold">Anonymous</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--ink-muted)' }}>No ID check</p>
                </button>
                <button
                  type="button"
                  onClick={() => setIdentityMode('identified')}
                  className="flex-1 p-4 rounded-xl text-center transition-all border-2"
                  style={{
                    background: identityMode === 'identified' ? 'rgba(42,90,106,0.1)' : 'transparent',
                    borderColor: identityMode === 'identified' ? 'var(--teal)' : 'var(--border)',
                    color: identityMode === 'identified' ? 'var(--teal)' : 'var(--ink)',
                  }}
                >
                  <p className="text-sm font-semibold">Identified</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--ink-muted)' }}>Name required</p>
                </button>
              </div>
              <p className="text-[10px] mt-2" style={{ color: 'var(--ink-muted)' }}>
                {identityMode === 'anonymous'
                  ? 'Passengers can board without showing ID -- messages are anonymous'
                  : 'Passengers must provide their name at the gate'}
              </p>
            </div>

            {error && (
              <p className="text-xs" style={{ color: 'var(--error)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-takeoff w-full"
              disabled={createMutation.isPending}
            >
              <span>{createMutation.isPending ? 'Scheduling...' : 'Schedule Flight'}</span>
              <SmallPlaneIcon size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
