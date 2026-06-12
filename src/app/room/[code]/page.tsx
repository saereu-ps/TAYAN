'use client';

import { useState, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { ThemeToggle } from '../../theme-provider';

const AIRLINES = [
  { name: 'Thai Airways', className: 'airline-thai', label: 'TG' },
  { name: 'AirAsia', className: 'airline-airasia', label: 'FD' },
  { name: 'Bangkok Airways', className: 'airline-bangkok', label: 'PG' },
  { name: 'Nok Air', className: 'airline-nok', label: 'DD' },
  { name: 'Thai Smile', className: 'airline-smile', label: 'WE' },
];

function getAirlineForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return AIRLINES[Math.abs(hash) % AIRLINES.length];
}

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

function TerminalBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        {/* Terminal interior — large window panes */}
        <g opacity="0.08" stroke="currentColor" fill="none" strokeWidth="0.8">
          {/* Floor-to-ceiling windows */}
          <rect x="0" y="50" width="150" height="500" rx="2"/>
          <line x1="0" y1="150" x2="150" y2="150"/>
          <line x1="0" y1="250" x2="150" y2="250"/>
          <line x1="0" y1="350" x2="150" y2="350"/>
          <line x1="0" y1="450" x2="150" y2="450"/>
          <line x1="75" y1="50" x2="75" y2="550"/>

          <rect x="1050" y="50" width="150" height="500" rx="2"/>
          <line x1="1050" y1="150" x2="1200" y2="150"/>
          <line x1="1050" y1="250" x2="1200" y2="250"/>
          <line x1="1050" y1="350" x2="1200" y2="350"/>
          <line x1="1050" y1="450" x2="1200" y2="450"/>
          <line x1="1125" y1="50" x2="1125" y2="550"/>
        </g>

        {/* Planes visible through windows */}
        <g opacity="0.06" fill="currentColor">
          <g transform="translate(40, 200) rotate(-5)">
            <path d="M0 0 L30 -1.5 L35 0 L30 1.5 L0 0Z"/>
            <path d="M10 -1.5 L8 -8 L18 -8 L16 -1.5"/>
            <path d="M10 1.5 L8 8 L18 8 L16 1.5"/>
          </g>
          <g transform="translate(1100, 300) rotate(3)">
            <path d="M0 0 L25 -1 L29 0 L25 1 L0 0Z"/>
            <path d="M8 -1 L6 -6 L15 -6 L13 -1"/>
            <path d="M8 1 L6 6 L15 6 L13 1"/>
          </g>
        </g>

        {/* Floor tiles pattern */}
        <g opacity="0.04" stroke="currentColor" strokeWidth="0.3">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={600 + i * 20} x2="1200" y2={600 + i * 20}/>
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 50} y1="600" x2={i * 50} y2="800"/>
          ))}
        </g>

        {/* Departure sign shapes */}
        <g opacity="0.05" fill="currentColor">
          <rect x="500" y="30" width="200" height="20" rx="3"/>
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
        <TerminalBg />
        <ThemeToggle />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm text-center">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-6"
            style={{ color: 'var(--blue)' }}
          >
            <AirplaneIcon size={80} />
          </motion.div>

          {roomQuery.isLoading && <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Locating gate...</p>}

          {roomQuery.isError && (
            <div className="card">
              <p className="text-sm font-medium" style={{ color: 'var(--error)' }}>Flight not found</p>
              <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>Check your flight code and try again</p>
            </div>
          )}

          {room && room.status === 'active' && (
            <div className="card relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 airline-bangkok" />
              <h1 className="heading text-xl font-semibold mb-1 mt-2">{room.name}</h1>
              <p className="text-xs mb-6" style={{ color: 'var(--ink-muted)' }}>
                {room.identityMode === 'anonymous' ? 'Anonymous boarding — no ID required' : 'Identified boarding — name required'}
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
                  <AirplaneIcon size={18} />
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

  // --- MAIN ROOM VIEW (Departure Gate) ---
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <TerminalBg />
      <ThemeToggle />

      {/* === SEND ANIMATION — Dramatic takeoff === */}
      <AnimatePresence>
        {showFly && (
          <motion.div
            className="backdrop-send"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Runway line */}
            <motion.div
              className="absolute bottom-[45%] left-0 right-0 overflow-hidden h-[3px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2, times: [0, 0.05, 0.7, 1] }}
            >
              <div className="runway-line" />
            </motion.div>

            {/* The airplane */}
            <motion.div
              style={{ color: '#fff' }}
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
              <AirplaneIcon size={150} />
            </motion.div>

            {/* Exhaust puffs */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 16 + i * 6,
                  height: 16 + i * 6,
                  background: 'rgba(148, 163, 184, 0.4)',
                }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                animate={{
                  opacity: [0, 0.5, 0],
                  x: [-40 - i * 30, -80 - i * 50],
                  y: [20 + i * 10, 40 + i * 20],
                  scale: [1, 2.5],
                }}
                transition={{ duration: 1.2, delay: 0.75 + i * 0.15, ease: 'easeOut' }}
              />
            ))}

            {/* Status text */}
            <motion.p
              className="absolute bottom-[30%] text-sm font-medium tracking-wide"
              style={{ color: 'rgba(255,255,255,0.8)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, -10] }}
              transition={{ duration: 2, times: [0, 0.2, 0.35, 0.8, 1] }}
            >
              Cleared for takeoff...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast — Flight departed */}
      <AnimatePresence>
        {showSent && (
          <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-xs font-medium flex items-center gap-2"
            style={{ background: 'var(--success)', color: '#fff' }}
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
          >
            <AirplaneIcon size={14} />
            Flight departed
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header — Departure Gate Display */}
      <div className="relative z-10 px-6 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="fids-font text-[10px] uppercase tracking-widest px-2 py-0.5 rounded" style={{ color: 'var(--blue)', background: 'var(--blue-light)' }}>
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

      {/* Broadcasts — Landed flights as boarding passes */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          {broadcasts.length > 0 && (
            <p className="fids-font text-[10px] uppercase tracking-widest mb-4 font-medium" style={{ color: 'var(--ink-muted)' }}>
              ✈ Arrived Flights
            </p>
          )}

          {broadcasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-40 text-center py-20">
              <AirplaneIcon size={48} />
              <p className="text-sm mt-4">No flights landed yet</p>
              <p className="text-xs mt-1">Send your first message below</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {broadcasts.map((plane) => {
                  const airline = getAirlineForId(plane.id);
                  const isExpanded = expandedIds.has(plane.id);

                  return (
                    <motion.div
                      key={plane.id}
                      initial={{ opacity: 0, x: 80, rotate: 1 }}
                      animate={{ opacity: 1, x: 0, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 80, damping: 14 }}
                      className="card-boarding-pass cursor-pointer"
                      onClick={() => toggleExpand(plane.id)}
                    >
                      {/* Airline color strip */}
                      <div className={`h-2 ${airline.className}`} />

                      {/* Collapsed: just airline + time + tap to read */}
                      <div className="px-5 pt-3 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="fids-font text-[10px] font-bold tracking-wider" style={{ color: 'var(--ink)' }}>
                            {airline.label}-{plane.id.slice(-4).toUpperCase()}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: 'var(--ink-muted)' }}>
                            {plane.isPinned ? '⭐ Priority' : airline.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="fids-font text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                            {new Date(plane.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {!isExpanded && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>
                              Tap to read
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expanded: full content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="boarding-pass-divider" />
                            <div className="px-5 pb-4 pt-3">
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

      {/* Composer — Beautiful card with large textarea */}
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
                <AirplaneIcon size={28} />
              </button>
            </div>
          </div>
          {error && <p className="text-xs mt-2" style={{ color: 'var(--error)' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
