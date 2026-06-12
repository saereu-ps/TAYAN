'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { ThemeToggle } from '../../theme-provider';

function AirplaneIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="65" cy="28" rx="48" ry="9" fill="#f0ebe0"/>
      <path d="M17 28 C17 34 40 37 65 37 C90 37 113 34 113 28" fill="#2a5a6a" opacity="0.9"/>
      <path d="M50 32 L38 52 L82 52 L72 32Z" fill="#2a5a6a"/>
      <path d="M52 32 L44 46 L76 46 L70 32Z" fill="#3a7a8a" opacity="0.4"/>
      <path d="M18 28 L10 12 L24 14 L22 28Z" fill="#2a5a6a"/>
      <path d="M18 22 L14 16 L22 17Z" fill="#f0ebe0"/>
      <ellipse cx="52" cy="44" rx="5" ry="3.5" fill="#3a6a7a"/>
      <ellipse cx="72" cy="44" rx="5" ry="3.5" fill="#3a6a7a"/>
      <ellipse cx="52" cy="44" rx="3" ry="2" fill="#1a3a4a"/>
      <ellipse cx="72" cy="44" rx="3" ry="2" fill="#1a3a4a"/>
      <g fill="#5b9bd5">
        <rect x="35" y="25" width="3" height="4" rx="1.5"/>
        <rect x="42" y="25" width="3" height="4" rx="1.5"/>
        <rect x="49" y="25" width="3" height="4" rx="1.5"/>
        <rect x="56" y="25" width="3" height="4" rx="1.5"/>
        <rect x="63" y="25" width="3" height="4" rx="1.5"/>
        <rect x="70" y="25" width="3" height="4" rx="1.5"/>
        <rect x="77" y="25" width="3" height="4" rx="1.5"/>
        <rect x="84" y="25" width="3" height="4" rx="1.5"/>
        <rect x="91" y="25" width="3" height="4" rx="1.5"/>
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

function TerminalWindowBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        {/* Sky blue base */}
        <rect width="1200" height="800" fill="#5b9bd5"/>

        {/* Terminal window frame — dark teal rectangle */}
        <rect x="60" y="40" width="1080" height="720" rx="12" fill="#2a5a6a" opacity="0.3"/>
        <rect x="80" y="60" width="1040" height="680" rx="8" fill="none" stroke="#2a5a6a" strokeWidth="3" opacity="0.4"/>

        {/* Through the window: distant clouds */}
        <ellipse cx="300" cy="200" rx="80" ry="30" fill="#f5e8c8" opacity="0.4"/>
        <ellipse cx="340" cy="190" rx="60" ry="25" fill="#f5e8c8" opacity="0.3"/>
        <ellipse cx="850" cy="180" rx="90" ry="32" fill="#f5e8c8" opacity="0.35"/>
        <ellipse cx="900" cy="170" rx="60" ry="22" fill="#fff8e8" opacity="0.3"/>

        {/* Small plane visible through window */}
        <g transform="translate(750, 220) rotate(-8) scale(0.5)" opacity="0.4">
          <ellipse cx="65" cy="28" rx="48" ry="9" fill="#f0ebe0"/>
          <path d="M17 28 C17 34 40 37 65 37 C90 37 113 34 113 28" fill="#2a5a6a"/>
          <path d="M50 32 L38 52 L82 52 L72 32Z" fill="#2a5a6a"/>
          <path d="M18 28 L10 12 L24 14 L22 28Z" fill="#2a5a6a"/>
        </g>

        {/* Window frame dividers */}
        <line x1="600" y1="60" x2="600" y2="740" stroke="#2a5a6a" strokeWidth="2" opacity="0.15"/>
        <line x1="80" y1="400" x2="1120" y2="400" stroke="#2a5a6a" strokeWidth="2" opacity="0.15"/>
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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
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
        setTimeout(() => setShowSent(false), 2500);
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

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const room = roomQuery.data || joinMutation.data?.room;
  const broadcasts = broadcastsQuery.data ?? [];

  // --- JOIN SCREEN ---
  if (!joined) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <TerminalWindowBg />
        <ThemeToggle />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm text-center">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-6 inline-block"
          >
            <AirplaneIcon size={90} />
          </motion.div>

          {roomQuery.isLoading && <p className="text-sm text-white/70">Locating gate...</p>}

          {roomQuery.isError && (
            <div className="card">
              <p className="text-sm font-medium" style={{ color: 'var(--error)' }}>Flight not found</p>
              <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>Check your flight code and try again</p>
            </div>
          )}

          {room && room.status === 'active' && (
            <div className="card relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: 'var(--accent)' }} />
              <h1 className="heading text-xl font-semibold mb-1 mt-2">{room.name}</h1>
              <p className="text-xs mb-6" style={{ color: 'var(--ink-muted)' }}>
                {room.identityMode === 'anonymous' ? 'Anonymous boarding -- no ID required' : 'Identified boarding -- name required'}
              </p>
              <form onSubmit={handleJoin}>
                {room.identityMode === 'identified' && (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Passenger name"
                    className="input-zen mb-4"
                    autoFocus
                  />
                )}
                {error && <p className="text-xs mb-3" style={{ color: 'var(--error)' }}>{error}</p>}
                <button type="submit" className="btn-takeoff w-full" disabled={joinMutation.isPending}>
                  <span>{joinMutation.isPending ? 'Boarding...' : 'Board Flight'}</span>
                  <SmallPlaneIcon size={18} />
                </button>
              </form>
            </div>
          )}

          {room && room.status !== 'active' && (
            <div className="card">
              <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                This flight has {room.status === 'closed' ? 'landed' : 'been delayed'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // --- MAIN ROOM VIEW ---
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <TerminalWindowBg />
      <ThemeToggle />

      {/* === SEND ANIMATION === */}
      <AnimatePresence>
        {showFly && (
          <motion.div
            className="backdrop-send"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* The airplane — poster colors */}
            <motion.div
              initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
              animate={{
                x: [0, 0, 0, 80, 250, 500],
                y: [0, 0, 0, 0, -100, -350],
                rotate: [0, 0, 0, 0, -15, -15],
                scale: [1, 1, 1, 1, 0.8, 0.5],
                opacity: [1, 1, 1, 1, 0.9, 0],
              }}
              transition={{
                duration: 2,
                times: [0, 0.05, 0.15, 0.3, 0.6, 1],
                ease: [0.4, 0, 0.2, 1],
              }}
              className="engine-rev"
            >
              <AirplaneIcon size={160} />
            </motion.div>

            {/* Exhaust puffs */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 16 + i * 6,
                  height: 16 + i * 6,
                  background: 'rgba(245,232,200,0.5)',
                }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                animate={{
                  opacity: [0, 0.6, 0],
                  x: [-40 - i * 30, -80 - i * 50],
                  y: [20 + i * 10, 40 + i * 20],
                  scale: [1, 2.5],
                }}
                transition={{ duration: 1.2, delay: 0.75 + i * 0.15, ease: 'easeOut' }}
              />
            ))}

            {/* Status text */}
            <motion.p
              className="absolute bottom-[30%] text-sm font-medium tracking-wide text-white/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, -10] }}
              transition={{ duration: 2, times: [0, 0.2, 0.35, 0.8, 1] }}
            >
              Cleared for takeoff...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showSent && (
          <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-xs font-medium flex items-center gap-2"
            style={{ background: 'var(--success)', color: '#fff' }}
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
          >
            <SmallPlaneIcon size={14} />
            Flight departed
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header — Gate Display */}
      <div className="relative z-10 px-6 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="fids-font text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md font-bold" style={{ color: '#fff', background: 'var(--teal)' }}>
                Gate {code.slice(0, 2)}
              </span>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>Destination</span>
            </div>
            <h1 className="heading text-lg font-semibold mt-1">{room?.name}</h1>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
              <span className="fids-font text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--success)' }}>
                {room?.status === 'active' ? 'Boarding' : 'Departed'}
              </span>
            </div>
            <p className="text-[10px] mt-1" style={{ color: 'var(--ink-muted)' }}>
              {name ? `Passenger: ${name}` : 'Anonymous Passenger'}
            </p>
          </div>
        </div>
      </div>

      {/* Broadcasts */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          {broadcasts.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <SmallPlaneIcon size={12} />
              <p className="fids-font text-[10px] uppercase tracking-widest font-medium" style={{ color: 'var(--ink-muted)' }}>
                Arrived Flights
              </p>
            </div>
          )}

          {broadcasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-40 text-center py-20">
              <AirplaneIcon size={56} />
              <p className="text-sm mt-4">No flights landed yet</p>
              <p className="text-xs mt-1">Send your first message below</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {broadcasts.map((plane) => {
                  const isExpanded = expandedIds.has(plane.id);
                  return (
                    <motion.div
                      key={plane.id}
                      initial={{ opacity: 0, x: 80 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: 'spring', stiffness: 80, damping: 14 }}
                      className="card-broadcast cursor-pointer"
                      onClick={() => toggleExpand(plane.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span style={{ color: 'var(--teal)' }}>
                            <SmallPlaneIcon size={16} />
                          </span>
                          <span className="fids-font text-[10px] font-bold tracking-wider" style={{ color: 'var(--ink)' }}>
                            {plane.id.slice(-5).toUpperCase()}
                          </span>
                          {plane.isPinned && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(232,144,80,0.15)', color: 'var(--orange)' }}>
                              Priority
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="fids-font text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                            {new Date(plane.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {!isExpanded && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(42,90,106,0.1)', color: 'var(--teal)' }}>
                              Tap to read
                            </span>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                              <p className="text-sm leading-relaxed">{plane.content}</p>
                              <p className="text-[10px] mt-3" style={{ color: 'var(--ink-muted)' }}>
                                From: {plane.senderName || 'Anonymous Passenger'}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
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
              placeholder="What's on your mind?"
              rows={4}
              maxLength={500}
              className="w-full bg-transparent resize-none outline-none text-sm leading-relaxed"
              style={{ color: 'var(--ink)' }}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend(); }}
              disabled={isSending}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] fids-font" style={{ color: 'var(--ink-muted)' }}>{message.length}/500</span>
              <button
                onClick={handleSend}
                disabled={!message.trim() || isSending}
                className="btn-send"
                aria-label="Send message"
              >
                <svg width="28" height="14" viewBox="0 0 120 60" fill="none">
                  <ellipse cx="65" cy="28" rx="48" ry="9" fill="#fff"/>
                  <path d="M17 28 C17 34 40 37 65 37 C90 37 113 34 113 28" fill="rgba(255,255,255,0.6)"/>
                  <path d="M50 32 L38 52 L82 52 L72 32Z" fill="rgba(255,255,255,0.8)"/>
                  <path d="M18 28 L10 12 L24 14 L22 28Z" fill="rgba(255,255,255,0.8)"/>
                </svg>
              </button>
            </div>
          </div>
          {error && <p className="text-xs mt-2" style={{ color: 'var(--error)' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
