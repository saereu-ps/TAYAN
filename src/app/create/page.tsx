'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
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
    <div className="min-h-screen px-6 py-8 max-w-lg mx-auto" style={{ backgroundColor: 'var(--cream)' }}>
      {/* Back */}
      <button
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity mb-8"
      >
        <BackIcon /> Back to dashboard
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl font-medium mb-6" style={{ color: 'var(--ink)' }}>
          Create New Room
        </h1>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {/* Room Name */}
          <div>
            <label className="block text-xs font-medium mb-2 opacity-70">Room Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Team Standup Q&A"
              className="input-zen"
              autoFocus
            />
          </div>

          {/* Identity Mode */}
          <div>
            <label className="block text-xs font-medium mb-3 opacity-70">Identity Mode</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIdentityMode('anonymous')}
                className="flex-1 p-3 rounded-md text-sm text-center transition-all"
                style={{
                  backgroundColor: identityMode === 'anonymous' ? 'var(--ink)' : 'var(--paper)',
                  color: identityMode === 'anonymous' ? 'var(--cream)' : 'var(--ink)',
                  border: `1px solid ${identityMode === 'anonymous' ? 'var(--ink)' : 'var(--border)'}`,
                }}
              >
                Anonymous
              </button>
              <button
                type="button"
                onClick={() => setIdentityMode('identified')}
                className="flex-1 p-3 rounded-md text-sm text-center transition-all"
                style={{
                  backgroundColor: identityMode === 'identified' ? 'var(--ink)' : 'var(--paper)',
                  color: identityMode === 'identified' ? 'var(--cream)' : 'var(--ink)',
                  border: `1px solid ${identityMode === 'identified' ? 'var(--ink)' : 'var(--border)'}`,
                }}
              >
                Identified
              </button>
            </div>
            <p className="text-xs opacity-50 mt-2">
              {identityMode === 'anonymous'
                ? 'Participants can send messages without revealing their name'
                : 'Participants must provide their name when sending'}
            </p>
          </div>

          {error && (
            <p className="text-xs" style={{ color: 'var(--vermillion)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-vermillion w-full"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Room'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
