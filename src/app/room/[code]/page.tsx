'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { ThemeToggle, useTheme } from '../../theme-provider';

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

function TerminalWindowBg() {
  const { theme } = useTheme();
  const isNight = theme === 'night';

  const skyColor = isNight ? '#1a2040' : '#5b9bd5';
  const frameColor = isNight ? '#2a3a5a' : '#2a5a6a';
  const cloudColor = isNight ? '#2a3a5a' : '#f5e8c8';
  const cloudHighlight = isNight ? '#3a4a6a' : '#fff8e8';

  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <rect width="1200" height="800" fill={skyColor}/>

        {/* Stars (night only) */}
        {isNight && (
          <g>
            <circle cx="120" cy="80" r="1.5" fill="#ffffff" opacity="0.5"/>
            <circle cx="280" cy="120" r="1" fill="#ffffff" opacity="0.4"/>
            <circle cx="420" cy="70" r="2" fill="#ffffff" opacity="0.6"/>
            <circle cx="600" cy="100" r="1.5" fill="#ffffff" opacity="0.3"/>
            <circle cx="780" cy="60" r="1" fill="#ffffff" opacity="0.7"/>
            <circle cx="950" cy="90" r="2" fill="#ffffff" opacity="0.4"/>
            <circle cx="1100" cy="80" r="1.5" fill="#ffffff" opacity="0.5"/>
            <circle cx="200" cy="200" r="1" fill="#ffffff" opacity="0.3"/>
            <circle cx="500" cy="250" r="1.5" fill="#ffffff" opacity="0.4"/>
            <circle cx="850" cy="180" r="2" fill="#ffffff" opacity="0.5"/>
            <circle cx="1050" cy="220" r="1" fill="#ffffff" opacity="0.6"/>
            <circle cx="350" cy="320" r="1.5" fill="#ffffff" opacity="0.3"/>
          </g>
        )}

        {/* Terminal window frame */}
        <rect x="60" y="40" width="1080" height="720" rx="12" fill={frameColor} opacity="0.3"/>
        <rect x="80" y="60" width="1040" height="680" rx="8" fill="none" stroke={frameColor} strokeWidth="3" opacity="0.4"/>

        {/* Through the window: clouds */}
        <ellipse cx="300" cy="200" rx="80" ry="30" fill={cloudColor} opacity="0.4"/>
        <ellipse cx="340" cy="190" rx="60" ry="25" fill={cloudColor} opacity="0.3"/>
        <ellipse cx="850" cy="180" rx="90" ry="32" fill={cloudColor} opacity="0.35"/>
        <ellipse cx="900" cy="170" rx="60" ry="22" fill={cloudHighlight} opacity="0.3"/>

        {/* Small plane visible through window */}
        <g transform="translate(750, 220) rotate(-8) scale(0.5)" opacity="0.4">
          <path d="M20 48 Q30 38 60 36 L170 36 Q185 36 192 42 Q198 48 192 54 Q185 60 170 60 L60 60 Q30 58 20 48Z" fill="#f0ebe0"/>
          <path d="M30 52 Q60 62 120 62 Q160 62 185 56 Q190 54 188 52 L170 60 L60 60 Q35 58 30 52Z" fill="#d4d0c8" opacity="0.5"/>
          <path d="M40 46 L180 46 L180 48 L40 48Z" fill="#4b2d8e"/>
          <path d="M28 48 L20 20 L40 22 L42 40Z" fill="#4b2d8e"/>
          <path d="M80 55 L65 88 L130 88 L115 55Z" fill="#c8c4bc"/>
        </g>

        {/* Window frame dividers */}
        <line x1="600" y1="60" x2="600" y2="740" stroke={frameColor} strokeWidth="2" opacity="0.15"/>
        <line x1="80" y1="400" x2="1120" y2="400" stroke={frameColor} strokeWidth="2" opacity="0.15"/>
      </svg>
    </div>
  );
}

export default function ParticipantRoomPage() {
  const params = useParams();
  const router = useRouter();
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
  const [exchangeSubmitted, setExchangeSubmitted] = useState(false);
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

  // Exchange mode hooks
  const roomId = roomQuery.data?.id || joinMutation.data?.room.id || '';
  const roomMode = roomQuery.data?.mode || joinMutation.data?.room.mode;
  const exchangeStatusQuery = trpc.exchange.getStatus.useQuery(
    { roomId },
    { enabled: joined && !!roomId && roomMode === 'exchange', refetchInterval: 2000 },
  );
  const exchangeSubmitMutation = trpc.exchange.submit.useMutation({
    onSuccess: () => { setExchangeSubmitted(true); setMessage(''); },
    onError: (err) => setError(err.message),
  });
  const myMessageQuery = trpc.exchange.getMyMessage.useQuery(
    { roomId, participantId: sessionId },
    { enabled: joined && !!roomId && !!sessionId && exchangeSubmitted && roomMode === 'exchange', refetchInterval: 3000 },
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
    const currentRoomId = roomQuery.data?.id || joinMutation.data?.room.id;
    if (!currentRoomId) return;
    setIsSending(true);
    sendMutation.mutate({ roomId: currentRoomId, content: message.trim(), senderName: name || undefined, senderSessionId: sessionId });
  };

  const handleExchangeSubmit = () => {
    if (!message.trim()) return;
    const currentRoomId = roomQuery.data?.id || joinMutation.data?.room.id;
    if (!currentRoomId) return;
    exchangeSubmitMutation.mutate({
      roomId: currentRoomId,
      participantId: sessionId,
      participantName: name || undefined,
      content: message.trim(),
    });
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

        {/* Home button */}
        <button
          onClick={() => router.push('/')}
          className="fixed top-5 left-5 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'var(--bg-card, rgba(255,255,255,0.95))', border: '1px solid var(--border, #e8e0d4)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          title="Home"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm text-center">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-6 inline-block"
          >
            <AirplaneIcon size={140} />
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
  // Exchange mode
  if (room?.mode === 'exchange') {
    const receivedMessage = myMessageQuery.data;
    const exchangeStatus = exchangeStatusQuery.data;

    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <TerminalWindowBg />
        <ThemeToggle />

        {/* Home button */}
        <button
          onClick={() => router.push('/')}
          className="fixed top-5 left-5 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'var(--bg-card, rgba(255,255,255,0.95))', border: '1px solid var(--border, #e8e0d4)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          title="Home"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </button>

        {/* Header */}
        <div className="relative z-10 px-6 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="fids-font text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md font-bold" style={{ color: '#fff', background: '#e87060' }}>
                  Exchange
                </span>
                <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>Random Mode</span>
              </div>
              <h1 className="heading text-lg font-semibold mt-1">{room?.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] mt-1" style={{ color: 'var(--ink-muted)' }}>
                {name ? `Passenger: ${name}` : 'Anonymous Passenger'}
              </p>
            </div>
          </div>
        </div>

        {/* Exchange Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
          <div className="w-full max-w-md">
            {/* Phase 1: Write */}
            {!exchangeSubmitted && !receivedMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h2 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Write your message for someone random</h2>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--ink-muted)' }}>
                    Your message will be shuffled and delivered to another participant
                  </p>
                </div>

                <div className="card-paper">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something meaningful..."
                    rows={6}
                    maxLength={500}
                    className="w-full bg-transparent resize-none outline-none text-sm leading-relaxed"
                    style={{ color: 'var(--ink)' }}
                    autoFocus
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] fids-font" style={{ color: 'var(--ink-muted)' }}>{message.length}/500</span>
                  </div>
                </div>

                <button
                  onClick={handleExchangeSubmit}
                  disabled={!message.trim() || exchangeSubmitMutation.isPending}
                  className="btn-takeoff w-full"
                >
                  <span>{exchangeSubmitMutation.isPending ? 'Submitting...' : 'Submit Message'}</span>
                  <SmallPlaneIcon size={18} />
                </button>

                {error && <p className="text-xs text-center" style={{ color: 'var(--error)' }}>{error}</p>}
              </motion.div>
            )}

            {/* Phase 2: Waiting */}
            {exchangeSubmitted && !receivedMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="28" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
                    <g transform="translate(20, 24)">
                      <path d="M22 4H16L12 0H10L12 4H6L4 2H2L4 6L2 10H4L6 8H12L10 12H12L16 8H22C23 8 24 7.5 24 6C24 4.5 23 4 22 4Z" fill="var(--ink)" opacity="0.6"/>
                    </g>
                  </svg>
                </motion.div>

                <div>
                  <h2 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Message submitted</h2>
                  <p className="text-xs mt-2" style={{ color: 'var(--ink-muted)' }}>
                    Waiting for Control Tower to dispatch...
                  </p>
                </div>

                {exchangeStatus && (
                  <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <p className="text-xs font-mono" style={{ color: 'var(--ink-muted)' }}>
                      {exchangeStatus.totalSubmitted} / {exchangeStatus.totalParticipants} messages submitted
                    </p>
                    <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'var(--border)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: exchangeStatus.totalParticipants ? `${Math.min(100, (exchangeStatus.totalSubmitted / exchangeStatus.totalParticipants) * 100)}%` : '0%',
                          background: '#e87060',
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Phase 3: Received */}
            {receivedMessage && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    <AirplaneIcon size={100} />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xs mt-3 font-medium"
                    style={{ color: 'var(--ink-muted)' }}
                  >
                    A message has arrived for you
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="rounded-2xl p-6 shadow-lg"
                  style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
                    {receivedMessage.message}
                  </p>
                  {receivedMessage.senderName && (
                    <p className="text-[10px] mt-4 pt-3" style={{ color: 'var(--ink-muted)', borderTop: '1px solid var(--border)' }}>
                      From: {receivedMessage.senderName}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- DIRECT MODE ROOM VIEW ---
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <TerminalWindowBg />
      <ThemeToggle />

      {/* Home button */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-5 left-5 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{ background: 'var(--bg-card, rgba(255,255,255,0.95))', border: '1px solid var(--border, #e8e0d4)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        title="Home"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </button>

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

      {/* Header */}
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
              <AirplaneIcon size={100} />
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
                <svg width="28" height="14" viewBox="0 0 200 100" fill="none">
                  <path d="M20 48 Q30 38 60 36 L170 36 Q185 36 192 42 Q198 48 192 54 Q185 60 170 60 L60 60 Q30 58 20 48Z" fill="#fff"/>
                  <path d="M40 46 L180 46 L180 48 L40 48Z" fill="rgba(255,255,255,0.7)"/>
                  <path d="M28 48 L20 20 L40 22 L42 40Z" fill="rgba(255,255,255,0.8)"/>
                  <path d="M80 55 L65 88 L130 88 L115 55Z" fill="rgba(255,255,255,0.7)"/>
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
