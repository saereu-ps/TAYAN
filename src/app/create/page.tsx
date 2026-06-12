'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle } from '../theme-provider';

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function YiPengLanternsBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        {/* Floating lanterns — Yi Peng style */}
        <g opacity="0.06" stroke="currentColor" strokeWidth="0.5" fill="none">
          {/* Lantern 1 */}
          <g transform="translate(150, 100)">
            <ellipse cx="0" cy="0" rx="18" ry="25"/>
            <path d="M-12 -20 Q0 -30 12 -20"/>
            <path d="M-8 25 L-5 35 L5 35 L8 25"/>
            <line x1="0" y1="35" x2="0" y2="45"/>
          </g>

          {/* Lantern 2 */}
          <g transform="translate(400, 180)">
            <ellipse cx="0" cy="0" rx="15" ry="22"/>
            <path d="M-10 -17 Q0 -25 10 -17"/>
            <path d="M-7 22 L-4 30 L4 30 L7 22"/>
            <line x1="0" y1="30" x2="0" y2="38"/>
          </g>

          {/* Lantern 3 */}
          <g transform="translate(700, 80)">
            <ellipse cx="0" cy="0" rx="20" ry="28"/>
            <path d="M-14 -22 Q0 -33 14 -22"/>
            <path d="M-9 28 L-6 38 L6 38 L9 28"/>
            <line x1="0" y1="38" x2="0" y2="48"/>
          </g>

          {/* Lantern 4 */}
          <g transform="translate(950, 150)">
            <ellipse cx="0" cy="0" rx="16" ry="23"/>
            <path d="M-11 -18 Q0 -27 11 -18"/>
            <path d="M-7 23 L-4 31 L4 31 L7 23"/>
            <line x1="0" y1="31" x2="0" y2="39"/>
          </g>

          {/* Lantern 5 */}
          <g transform="translate(250, 350)">
            <ellipse cx="0" cy="0" rx="14" ry="20"/>
            <path d="M-9 -16 Q0 -23 9 -16"/>
            <path d="M-6 20 L-4 27 L4 27 L6 20"/>
            <line x1="0" y1="27" x2="0" y2="34"/>
          </g>

          {/* Lantern 6 */}
          <g transform="translate(850, 320)">
            <ellipse cx="0" cy="0" rx="17" ry="24"/>
            <path d="M-12 -19 Q0 -28 12 -19"/>
            <path d="M-8 24 L-5 33 L5 33 L8 24"/>
            <line x1="0" y1="33" x2="0" y2="42"/>
          </g>

          {/* Lantern 7 */}
          <g transform="translate(550, 450)">
            <ellipse cx="0" cy="0" rx="13" ry="19"/>
            <path d="M-9 -15 Q0 -22 9 -15"/>
            <path d="M-6 19 L-4 26 L4 26 L6 19"/>
            <line x1="0" y1="26" x2="0" y2="33"/>
          </g>

          {/* Lantern 8 — large, distant */}
          <g transform="translate(1100, 500)">
            <ellipse cx="0" cy="0" rx="12" ry="17"/>
            <path d="M-8 -13 Q0 -20 8 -13"/>
            <path d="M-5 17 L-3 23 L3 23 L5 17"/>
            <line x1="0" y1="23" x2="0" y2="29"/>
          </g>
        </g>

        {/* Small stars / sparks */}
        <g opacity="0.04" fill="currentColor">
          <circle cx="180" cy="60" r="1.5"/>
          <circle cx="430" cy="140" r="1"/>
          <circle cx="720" cy="50" r="1.5"/>
          <circle cx="980" cy="110" r="1"/>
          <circle cx="300" cy="300" r="1"/>
          <circle cx="600" cy="250" r="1.5"/>
          <circle cx="1000" cy="350" r="1"/>
          <circle cx="100" cy="450" r="1.5"/>
          <circle cx="750" cy="400" r="1"/>
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
      setError('Room name is required');
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
      <YiPengLanternsBg />
      <ThemeToggle />

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-80"
          style={{ color: 'var(--ink-muted)' }}
        >
          <BackIcon /> Back to dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="heading text-xl font-semibold mb-6">Create New Room</h1>

          <form onSubmit={handleSubmit} className="card space-y-5">
            {/* Room Name */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--ink-muted)' }}>Room Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Team Standup Q and A"
                className="input-zen"
                autoFocus
              />
            </div>

            {/* Identity Mode */}
            <div>
              <label className="block text-xs font-medium mb-3" style={{ color: 'var(--ink-muted)' }}>Identity Mode</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIdentityMode('anonymous')}
                  className="flex-1 p-3 rounded-xl text-sm text-center transition-all"
                  style={{
                    background: identityMode === 'anonymous' ? 'var(--amber)' : 'var(--paper)',
                    color: identityMode === 'anonymous' ? '#fff' : 'var(--ink)',
                    border: `1.5px solid ${identityMode === 'anonymous' ? 'var(--amber)' : 'var(--border)'}`,
                  }}
                >
                  Anonymous
                </button>
                <button
                  type="button"
                  onClick={() => setIdentityMode('identified')}
                  className="flex-1 p-3 rounded-xl text-sm text-center transition-all"
                  style={{
                    background: identityMode === 'identified' ? 'var(--amber)' : 'var(--paper)',
                    color: identityMode === 'identified' ? '#fff' : 'var(--ink)',
                    border: `1.5px solid ${identityMode === 'identified' ? 'var(--amber)' : 'var(--border)'}`,
                  }}
                >
                  Identified
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--ink-muted)' }}>
                {identityMode === 'anonymous'
                  ? 'Participants can send messages without revealing their name'
                  : 'Participants must provide their name when sending'}
              </p>
            </div>

            {error && (
              <p className="text-xs" style={{ color: 'var(--error)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
