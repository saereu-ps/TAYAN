'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle } from '../theme-provider';

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

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function ScheduleBoardBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        {/* Airport runway pattern */}
        <g opacity="0.08" stroke="currentColor" fill="none" strokeWidth="0.6">
          {/* Taxiway lines */}
          <path d="M0 700 L300 700 Q350 700 350 650 L350 400" strokeDasharray="10 8"/>
          <path d="M600 800 L600 500 Q600 450 650 450 L1200 450" strokeDasharray="10 8"/>
          {/* Runway outline */}
          <rect x="800" y="100" width="60" height="600" rx="4"/>
          <line x1="830" y1="120" x2="830" y2="680" strokeDasharray="25 15" strokeWidth="1.5"/>
          {/* Threshold markings */}
          <line x1="810" y1="130" x2="810" y2="180" strokeWidth="2"/>
          <line x1="820" y1="130" x2="820" y2="180" strokeWidth="2"/>
          <line x1="840" y1="130" x2="840" y2="180" strokeWidth="2"/>
          <line x1="850" y1="130" x2="850" y2="180" strokeWidth="2"/>
        </g>

        {/* Gate assignments */}
        <g opacity="0.06" fill="currentColor" fontSize="10" fontFamily="monospace">
          <text x="100" y="200">A1</text>
          <text x="100" y="300">A2</text>
          <text x="100" y="400">A3</text>
          <text x="200" y="200">B1</text>
          <text x="200" y="300">B2</text>
        </g>

        {/* Aircraft silhouettes at gates */}
        <g opacity="0.06" fill="currentColor">
          <g transform="translate(130, 220) scale(0.35) rotate(90)">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
          <g transform="translate(230, 320) scale(0.3) rotate(90)">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
        </g>

        {/* Wind sock */}
        <g opacity="0.1" stroke="currentColor" fill="none" strokeWidth="0.8" transform="translate(1050, 150)">
          <line x1="0" y1="0" x2="0" y2="60"/>
          <path d="M0 0 L30 5 L30 -5 Z" fill="rgba(232,50,50,0.3)"/>
          <path d="M0 0 L30 5 L25 10" strokeWidth="0.5"/>
        </g>
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
      <ScheduleBoardBg />
      <ThemeToggle />

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-80"
          style={{ color: 'var(--ink-muted)' }}
        >
          <BackIcon /> Back to flight schedule
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <h1 className="heading text-xl font-semibold">Schedule New Flight</h1>
            <motion.div
              style={{ color: 'var(--blue)' }}
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <AirplaneIcon size={24} />
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="card relative overflow-hidden space-y-5">
            {/* Airline stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#76b82a] via-[#ffd100] to-[#f58220]" />

            {/* Destination (Room Name) */}
            <div className="mt-2">
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
                    background: identityMode === 'anonymous' ? 'var(--blue-light)' : 'transparent',
                    borderColor: identityMode === 'anonymous' ? 'var(--blue)' : 'var(--border)',
                    color: identityMode === 'anonymous' ? 'var(--blue)' : 'var(--ink)',
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
                    background: identityMode === 'identified' ? 'var(--blue-light)' : 'transparent',
                    borderColor: identityMode === 'identified' ? 'var(--blue)' : 'var(--border)',
                    color: identityMode === 'identified' ? 'var(--blue)' : 'var(--ink)',
                  }}
                >
                  <p className="text-sm font-semibold">Identified</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--ink-muted)' }}>Name required</p>
                </button>
              </div>
              <p className="text-[10px] mt-2" style={{ color: 'var(--ink-muted)' }}>
                {identityMode === 'anonymous'
                  ? 'Passengers can board without showing ID — messages are anonymous'
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
              <AirplaneIcon size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
