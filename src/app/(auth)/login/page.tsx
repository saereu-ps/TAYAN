'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';

function PaperPlaneIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
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
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--cream)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4" style={{ color: 'var(--vermillion)' }}>
            <PaperPlaneIcon />
          </div>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--ink)' }}>
            Welcome
          </h1>
          <p className="text-sm mt-1 opacity-60">Enter your name to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card">
          <label className="block text-xs font-medium mb-2 opacity-70">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="input-zen mb-4"
            autoFocus
          />
          {error && (
            <p className="text-xs mb-3" style={{ color: 'var(--vermillion)' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            className="btn-ink w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Entering...' : 'Enter'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => router.push('/')}
            className="text-xs opacity-50 hover:opacity-80 transition-opacity"
          >
            Back to home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
