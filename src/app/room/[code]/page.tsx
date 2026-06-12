'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';

function PlaneIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 32L56 8L40 56L30 36L4 32Z" />
      <path d="M30 36L56 8" />
      <path d="M30 36L30 50L38 42" />
    </svg>
  );
}

export default function ParticipantRoomPage() {
  const params = useParams();
  const code = (params.code as string).toUpperCase();
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showFly, setShowFly] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const roomQuery = trpc.room.getByCode.useQuery({ code }, { enabled: !joined, retry: false });
  const joinMutation = trpc.room.join.useMutation({
    onSuccess: (data) => { setSessionId(data.sessionId); setJoined(true); },
    onError: (err) => setError(err.message),
  });
  const sendMutation = trpc.plane.send.useMutation({
    onSuccess: () => {
      setShowFly(true);
      setTimeout(() => { setShowFly(false); setIsSending(false); setMessage(''); }, 1500);
    },
    onError: (err) => { setError(err.message); setIsSending(false); },
  });
  const broadcastsQuery = trpc.plane.getBroadcasts.useQuery(
    { roomId: roomQuery.data?.id ?? joinMutation.data?.room.id ?? '' },
    { enabled: joined && !!(roomQuery.data?.id || joinMutation.data?.room.id), refetchInterval: 2000 },
  );

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const room = roomQuery.data;
    if (!room) return;
    if (room.identityMode === 'identified' && !name.trim()) { setError('Enter your name'); return; }
    setError('');
    joinMutation.mutate({ code, name: name.trim() || undefined });
  };

  const handleSend = () => {
    if (!message.trim() || isSending) return;
    const roomId = roomQuery.data?.id || joinMutation.data?.room.id;
    if (!roomId) return;
    setIsSending(true);
    sendMutation.mutate({ roomId, content: message.trim(), senderName: name || undefined, senderSessionId: sessionId });
  };

  const room = roomQuery.data || joinMutation.data?.room;
  const broadcasts = broadcastsQuery.data ?? [];

  // --- JOIN SCREEN ---
  if (!joined) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative" style={{ background: 'var(--bg)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-6"
            style={{ color: 'var(--amber)' }}
          >
            <PlaneIcon size={80} />
          </motion.div>

          {roomQuery.isLoading && <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Finding room...</p>}

          {roomQuery.isError && (
            <div className="card">
              <p className="text-sm font-medium" style={{ color: 'var(--vermillion)' }}>Room not found</p>
              <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>Check code and try again</p>
            </div>
          )}

          {room && room.status === 'active' && (
            <div className="card">
              <h1 className="heading text-xl font-semibold mb-1">{room.name}</h1>
              <p className="text-xs mb-6" style={{ color: 'var(--ink-muted)' }}>
                {room.identityMode === 'anonymous' ? 'Anonymous mode' : 'Your name will be shown'}
              </p>
              <form onSubmit={handleJoin}>
                {room.identityMode === 'identified' && (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="input-zen mb-4"
                    autoFocus
                  />
                )}
                {error && <p className="text-xs mb-3" style={{ color: 'var(--vermillion)' }}>{error}</p>}
                <button type="submit" className="btn-primary w-full" disabled={joinMutation.isPending}>
                  {joinMutation.isPending ? 'Joining...' : 'Join Room'}
                </button>
              </form>
            </div>
          )}

          {room && room.status !== 'active' && (
            <div className="card"><p className="text-sm" style={{ color: 'var(--ink-muted)' }}>This room is {room.status}</p></div>
          )}
        </motion.div>
      </div>
    );
  }

  // --- MAIN ROOM VIEW ---
  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'var(--bg)' }}>
      {/* Full-screen fly animation */}
      <AnimatePresence>
        {showFly && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ x: 0, y: 100, rotate: 0, scale: 1 }}
              animate={{
                x: [0, 100, 300, 500],
                y: [100, 0, -150, -400],
                rotate: [0, -10, -20, -35],
                scale: [1, 1.2, 1.0, 0.6],
                opacity: [1, 1, 0.9, 0],
              }}
              transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
              style={{ color: 'var(--amber)' }}
            >
              <PlaneIcon size={80} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h1 className="heading text-base font-semibold">{room?.name}</h1>
          <p className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>{name ? `as ${name}` : 'Anonymous'}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>Live</span>
        </div>
      </div>

      {/* Broadcasts */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {broadcasts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40 text-center py-20">
            <PlaneIcon size={48} />
            <p className="text-sm mt-4">No shared messages yet</p>
            <p className="text-xs mt-1">Send your first paper plane below</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-lg mx-auto">
            <AnimatePresence>
              {broadcasts.map((plane) => (
                <motion.div
                  key={plane.id}
                  initial={{ opacity: 0, x: 50, rotate: 3 }}
                  animate={{ opacity: 1, x: 0, rotate: plane.isPinned ? -0.5 : 0.3 }}
                  className="plane-landed"
                >
                  {plane.isPinned && (
                    <div className="text-[10px] font-semibold mb-2" style={{ color: 'var(--amber)' }}>Pinned</div>
                  )}
                  <p className="text-sm leading-relaxed">{plane.content}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[10px]" style={{ color: 'var(--ink-muted)' }}>{plane.senderName || 'Anonymous'}</span>
                    <span className="text-[10px]" style={{ color: 'var(--ink-muted)', opacity: 0.5 }}>
                      {new Date(plane.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="px-6 pb-6 pt-3">
        <div className="max-w-lg mx-auto">
          <motion.div
            className="card-paper relative"
            animate={isSending ? { scale: 0.95, opacity: 0.6 } : { scale: 1, opacity: 1 }}
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your question or thought..."
              rows={3}
              maxLength={500}
              className="w-full bg-transparent resize-none outline-none text-sm leading-relaxed"
              style={{ color: 'var(--ink)' }}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend(); }}
              disabled={isSending}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px]" style={{ color: 'var(--ink-muted)' }}>{message.length}/500</span>
              <button
                onClick={handleSend}
                disabled={!message.trim() || isSending}
                className="btn-send"
                aria-label="Send paper plane"
              >
                <PlaneIcon size={24} />
              </button>
            </div>
          </motion.div>
          {error && <p className="text-xs mt-2" style={{ color: 'var(--vermillion)' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
