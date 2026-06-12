'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUser } from '@clerk/nextjs';
import { ThemeToggle, useTheme } from '../theme-provider';

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

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function CreateBg() {
  const { theme } = useTheme();
  const isNight = theme === 'night';

  const skyColor = isNight ? '#1a2040' : '#5b9bd5';
  const planeColor = isNight ? '#2a3a5a' : '#2a5a6a';
  const contrailColor = isNight ? '#4a5a7a' : '#f5e0b0';

  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <rect width="1200" height="800" fill={skyColor}/>

        {/* Stars (night only) */}
        {isNight && (
          <g>
            <circle cx="100" cy="60" r="1.5" fill="#ffffff" opacity="0.5"/>
            <circle cx="250" cy="100" r="1" fill="#ffffff" opacity="0.4"/>
            <circle cx="400" cy="40" r="2" fill="#ffffff" opacity="0.6"/>
            <circle cx="550" cy="120" r="1.5" fill="#ffffff" opacity="0.3"/>
            <circle cx="700" cy="70" r="1" fill="#ffffff" opacity="0.7"/>
            <circle cx="850" cy="50" r="2" fill="#ffffff" opacity="0.4"/>
            <circle cx="1000" cy="90" r="1.5" fill="#ffffff" opacity="0.5"/>
            <circle cx="1150" cy="60" r="1" fill="#ffffff" opacity="0.6"/>
            <circle cx="180" cy="200" r="1" fill="#ffffff" opacity="0.3"/>
            <circle cx="380" cy="250" r="1.5" fill="#ffffff" opacity="0.4"/>
            <circle cx="600" cy="180" r="2" fill="#ffffff" opacity="0.5"/>
            <circle cx="800" cy="220" r="1" fill="#ffffff" opacity="0.6"/>
            <circle cx="1050" cy="250" r="1.5" fill="#ffffff" opacity="0.3"/>
            <circle cx="300" cy="400" r="1" fill="#ffffff" opacity="0.4"/>
            <circle cx="900" cy="380" r="2" fill="#ffffff" opacity="0.5"/>
            <circle cx="1100" cy="400" r="1.5" fill="#ffffff" opacity="0.3"/>
          </g>
        )}

        {/* Scattered airplane silhouettes */}
        <g fill={planeColor}>
          <g transform="translate(150, 120) scale(0.6) rotate(-15)" opacity="0.3">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
          <g transform="translate(950, 100) scale(0.4) rotate(12)" opacity="0.25">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
          <g transform="translate(100, 600) scale(0.7) rotate(-8)" opacity="0.2">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
          <g transform="translate(1020, 450) scale(0.5) rotate(20)" opacity="0.22">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
        </g>

        {/* Contrail streaks */}
        <line x1="100" y1="160" x2="350" y2="140" stroke={contrailColor} strokeWidth="3" opacity="0.3" strokeLinecap="round"/>
        <line x1="850" y1="130" x2="1100" y2="110" stroke={contrailColor} strokeWidth="2" opacity="0.25" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export default function CreateRoomPage() {
  const [name, setName] = useState('');
  const [identityMode, setIdentityMode] = useState<'anonymous' | 'identified'>('anonymous');
  const [mode, setMode] = useState<'direct' | 'exchange'>('direct');
  const [revealSenders, setRevealSenders] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user: clerkUser, isLoaded } = useUser();
  const userId = clerkUser?.id || null;

  useEffect(() => {
    if (isLoaded && !clerkUser) router.push('/login');
  }, [isLoaded, clerkUser, router]);

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
      mode,
      revealSenders,
      ownerId: userId,
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#5b9bd5' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">Loading...</p>
      </div>
    );
  }

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

            {/* Room Mode */}
            <div>
              <label className="block fids-font text-[10px] uppercase tracking-widest font-medium mb-3" style={{ color: 'var(--ink-muted)' }}>Room Mode</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMode('direct')}
                  className="flex-1 p-4 rounded-xl text-center transition-all border-2"
                  style={{
                    background: mode === 'direct' ? 'rgba(42,90,106,0.1)' : 'transparent',
                    borderColor: mode === 'direct' ? 'var(--teal)' : 'var(--border)',
                    color: mode === 'direct' ? 'var(--teal)' : 'var(--ink)',
                  }}
                >
                  <p className="text-sm font-semibold">Direct to Admin</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--ink-muted)' }}>Messages go to control tower</p>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('exchange')}
                  className="flex-1 p-4 rounded-xl text-center transition-all border-2"
                  style={{
                    background: mode === 'exchange' ? 'rgba(232,112,96,0.1)' : 'transparent',
                    borderColor: mode === 'exchange' ? '#e87060' : 'var(--border)',
                    color: mode === 'exchange' ? '#e87060' : 'var(--ink)',
                  }}
                >
                  <p className="text-sm font-semibold">Random Exchange</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--ink-muted)' }}>Shuffled between participants</p>
                </button>
              </div>
              <p className="text-[10px] mt-2" style={{ color: 'var(--ink-muted)' }}>
                {mode === 'direct'
                  ? 'Messages fly directly to the control tower for the admin to manage'
                  : 'Participants write messages, then admin dispatches them randomly -- no one gets their own'}
              </p>
            </div>

            {/* Reveal Senders (exchange mode only) */}
            {mode === 'exchange' && (
              <div className="flex items-center justify-between p-4 rounded-xl border-2" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Reveal Senders</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--ink-muted)' }}>Show who wrote each message after dispatch</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRevealSenders(!revealSenders)}
                  className="relative w-11 h-6 rounded-full transition-colors"
                  style={{ background: revealSenders ? '#e87060' : 'var(--border)' }}
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm"
                    style={{ transform: revealSenders ? 'translateX(20px)' : 'translateX(0)' }}
                  />
                </button>
              </div>
            )}

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
