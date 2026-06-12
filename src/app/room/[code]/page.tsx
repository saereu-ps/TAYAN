'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
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

function TerminalBg() {
  return (
    <div className="svg-bg opacity-[0.04]">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        {/* Runway lines */}
        <line x1="0" y1="750" x2="1200" y2="750" stroke="currentColor" strokeWidth="0.5" strokeDasharray="40 20"/>
        <line x1="0" y1="760" x2="1200" y2="760" stroke="currentColor" strokeWidth="0.3"/>
        {/* Clouds */}
        <g stroke="currentColor" strokeWidth="0.4" fill="none">
          <path d="M100 100 Q120 80 150 90 Q170 75 200 85 Q220 70 240 85 Q260 80 270 100"/>
          <path d="M500 60 Q520 45 545 55 Q560 40 580 50 Q600 45 610 60"/>
          <path d="M800 120 Q830 100 860 110 Q890 95 910 105 Q930 100 940 120"/>
          <path d="M300 180 Q320 165 340 175 Q360 160 380 170"/>
          <path d="M1000 80 Q1020 65 1040 75 Q1060 60 1080 70 Q1100 65 1110 80"/>
        </g>
        {/* Paper planes in sky */}
        <g stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.8">
          <path d="M150 300 L170 295 L165 308 L160 303 L150 300Z"/>
          <path d="M900 200 L920 195 L915 208 L910 203 L900 200Z"/>
          <path d="M600 350 L620 345 L615 358 L610 353 L600 350Z"/>
        </g>
        {/* Terminal building outline */}
        <g stroke="currentColor" strokeWidth="0.3" fill="none">
          <rect x="100" y="600" width="1000" height="150" rx="4"/>
          <path d="M100 650 L1100 650"/>
          <rect x="200" y="610" width="30" height="40" rx="2"/>
          <rect x="300" y="610" width="30" height="40" rx="2"/>
          <rect x="400" y="610" width="30" height="40" rx="2"/>
          <rect x="700" y="610" width="30" height="40" rx="2"/>
          <rect x="800" y="610" width="30" height="40" rx="2"/>
          <rect x="900" y="610" width="30" height="40" rx="2"/>
        </g>
      </svg>
    </div>
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
  const [showSent, setShowSent] = useState(false);
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
      setTimeout(() => {
        setShowFly(false);
        setIsSending(false);
        setMessage('');
        setShowSent(true);
        setTimeout(() => setShowSent(false), 2000);
      }, 2000);
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
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <TerminalBg />
        <ThemeToggle />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm text-center">
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
              <p className="text-sm font-medium" style={{ color: 'var(--error)' }}>Room not found</p>
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
                {error && <p className="text-xs mb-3" style={{ color: 'var(--error)' }}>{error}</p>}
                <button type="submit" className="btn-primary w-full" disabled={joinMutation.isPending}>
                  {joinMutation.isPending ? 'Boarding...' : 'Board Flight'}
                </button>
              </form>
            </div>
          )}

          {room && room.status !== 'active' && (
            <div className="card"><p className="text-sm" style={{ color: 'var(--ink-muted)' }}>This flight has {room.status === 'closed' ? 'landed' : 'been paused'}</p></div>
          )}
        </motion.div>
      </div>
    );
  }

  // --- MAIN ROOM VIEW (Airport Terminal / Departure Lounge) ---
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <TerminalBg />
      <ThemeToggle />

      {/* SEND ANIMATION — Full screen dramatic fly */}
      <AnimatePresence>
        {showFly && (
          <motion.div
            className="backdrop-send"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Trail dots */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)' }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 0.5, 0],
                  x: [0, 30 + i * 40, 60 + i * 60],
                  y: [0, -40 - i * 30, -80 - i * 50],
                }}
                transition={{ duration: 1.6, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
              />
            ))}
            {/* Flying plane */}
            <motion.div
              initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
              animate={{
                x: [0, 60, 200, 450],
                y: [0, -80, -200, -400],
                rotate: [0, -10, -20, -35],
                scale: [1, 1.2, 1.0, 0.6],
                opacity: [1, 1, 0.9, 0],
              }}
              transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
              style={{ color: 'var(--amber)' }}
            >
              <PlaneIcon size={120} />
            </motion.div>
            {/* Text */}
            <motion.p
              className="absolute text-sm font-medium mt-20"
              style={{ color: '#f0ebe0' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -20] }}
              transition={{ duration: 1.6 }}
            >
              Your message is flying...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sent toast */}
      <AnimatePresence>
        {showSent && (
          <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-xs font-medium"
            style={{ background: 'var(--teal)', color: '#fff' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Sent successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header — Departure Board style */}
      <div className="relative z-10 px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="departure-board">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>Destination</span>
              </div>
            </div>
            <h1 className="heading text-lg font-semibold mt-0.5">{room?.name}</h1>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--teal)' }} />
              <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--teal)' }}>
                {room?.status === 'active' ? 'Boarding' : 'Departed'}
              </span>
            </div>
            <p className="text-[10px] mt-1" style={{ color: 'var(--ink-muted)' }}>
              {name ? `Passenger: ${name}` : 'Anonymous'}
            </p>
          </div>
        </div>
      </div>

      {/* Broadcasts — displayed as "Arrivals" / boarding passes */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          {broadcasts.length > 0 && (
            <p className="text-[10px] uppercase tracking-widest mb-4 font-medium" style={{ color: 'var(--ink-muted)' }}>
              Arrivals
            </p>
          )}

          {broadcasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-40 text-center py-20">
              <PlaneIcon size={48} />
              <p className="text-sm mt-4">No shared messages yet</p>
              <p className="text-xs mt-1">Send your first paper plane below</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {broadcasts.map((plane) => (
                  <motion.div
                    key={plane.id}
                    initial={{ opacity: 0, x: 60, rotate: 2 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    className="card-boarding-pass"
                  >
                    <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: 'var(--amber)' }}>
                          {plane.isPinned ? 'Priority' : 'Message'}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono" style={{ color: 'var(--ink-muted)' }}>
                        {new Date(plane.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="boarding-pass-divider" />
                    <div className="px-5 pb-4 pt-2">
                      <p className="text-sm leading-relaxed">{plane.content}</p>
                      <p className="text-[10px] mt-3" style={{ color: 'var(--ink-muted)' }}>
                        {plane.senderName || 'Anonymous Passenger'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="relative z-10 px-6 pb-6 pt-3">
        <div className="max-w-2xl mx-auto">
          <div className="card-paper">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your question or thought..."
              rows={4}
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
                <PlaneIcon size={28} />
              </button>
            </div>
          </div>
          {error && <p className="text-xs mt-2" style={{ color: 'var(--error)' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
