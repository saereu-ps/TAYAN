'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle } from '../../theme-provider';

function AirplaneIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="65" cy="28" rx="48" ry="9" fill="#f0ebe0"/>
      <path d="M17 28 C17 34 40 37 65 37 C90 37 113 34 113 28" fill="#2a5a6a" opacity="0.9"/>
      <path d="M50 32 L38 52 L82 52 L72 32Z" fill="#2a5a6a"/>
      <path d="M18 28 L10 12 L24 14 L22 28Z" fill="#2a5a6a"/>
      <path d="M18 22 L14 16 L22 17Z" fill="#f0ebe0"/>
      <ellipse cx="52" cy="44" rx="5" ry="3.5" fill="#3a6a7a"/>
      <ellipse cx="72" cy="44" rx="5" ry="3.5" fill="#3a6a7a"/>
      <g fill="#5b9bd5">
        <rect x="35" y="25" width="3" height="4" rx="1.5"/>
        <rect x="49" y="25" width="3" height="4" rx="1.5"/>
        <rect x="63" y="25" width="3" height="4" rx="1.5"/>
        <rect x="77" y="25" width="3" height="4" rx="1.5"/>
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

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function BroadcastIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 17v5" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1V3H8v3h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function RadarBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        {/* Deeper sky */}
        <rect width="1200" height="800" fill="#4a8ac5"/>

        {/* Concentric radar circles in cream */}
        <circle cx="600" cy="400" r="100" stroke="#f0ebe0" strokeWidth="1" fill="none" opacity="0.15"/>
        <circle cx="600" cy="400" r="200" stroke="#f0ebe0" strokeWidth="1" fill="none" opacity="0.15"/>
        <circle cx="600" cy="400" r="300" stroke="#f0ebe0" strokeWidth="1" fill="none" opacity="0.15"/>
        <circle cx="600" cy="400" r="400" stroke="#f0ebe0" strokeWidth="1" fill="none" opacity="0.15"/>
        <circle cx="600" cy="400" r="500" stroke="#f0ebe0" strokeWidth="1" fill="none" opacity="0.15"/>

        {/* Crosshairs */}
        <line x1="600" y1="0" x2="600" y2="800" stroke="#f0ebe0" strokeWidth="0.5" opacity="0.1"/>
        <line x1="0" y1="400" x2="1200" y2="400" stroke="#f0ebe0" strokeWidth="0.5" opacity="0.1"/>
        <line x1="175" y1="0" x2="1025" y2="800" stroke="#f0ebe0" strokeWidth="0.5" opacity="0.08"/>
        <line x1="1025" y1="0" x2="175" y2="800" stroke="#f0ebe0" strokeWidth="0.5" opacity="0.08"/>

        {/* Radar blips */}
        <circle cx="450" cy="250" r="4" fill="#f0ebe0" opacity="0.25"/>
        <circle cx="750" cy="320" r="3" fill="#f0ebe0" opacity="0.2"/>
        <circle cx="380" cy="500" r="3" fill="#f0ebe0" opacity="0.2"/>
        <circle cx="820" cy="480" r="4" fill="#f0ebe0" opacity="0.25"/>
        <circle cx="550" cy="180" r="2.5" fill="#f0ebe0" opacity="0.18"/>
        <circle cx="700" cy="600" r="3" fill="#f0ebe0" opacity="0.2"/>
      </svg>
    </div>
  );
}

export default function AdminRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  const { userId } = useUserStore();
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [newPlaneIds, setNewPlaneIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (!userId) router.push('/login');
  }, [userId, router]);

  const roomQuery = trpc.room.getById.useQuery({ id: roomId }, { enabled: !!roomId });
  const planesQuery = trpc.plane.getByRoom.useQuery(
    { roomId },
    { enabled: !!roomId, refetchInterval: 2000 },
  );

  const broadcastMutation = trpc.plane.broadcast.useMutation({
    onSuccess: () => planesQuery.refetch(),
  });
  const unbroadcastMutation = trpc.plane.unbroadcast.useMutation({
    onSuccess: () => planesQuery.refetch(),
  });
  const pinMutation = trpc.plane.pin.useMutation({
    onSuccess: () => planesQuery.refetch(),
  });
  const removeMutation = trpc.plane.remove.useMutation({
    onSuccess: () => planesQuery.refetch(),
  });

  useEffect(() => {
    if (!planesQuery.data) return;
    if (initialLoadRef.current) {
      const ids = new Set(planesQuery.data.map((p) => p.id));
      setSeenIds(ids);
      initialLoadRef.current = false;
      return;
    }
    const incoming = new Set<string>();
    planesQuery.data.forEach((p) => {
      if (!seenIds.has(p.id)) {
        incoming.add(p.id);
        seenIds.add(p.id);
      }
    });
    if (incoming.size > 0) {
      setNewPlaneIds((prev) => new Set([...prev, ...incoming]));
      setSeenIds(new Set(seenIds));
      setTimeout(() => {
        setNewPlaneIds((prev) => {
          const next = new Set(prev);
          incoming.forEach((id) => next.delete(id));
          return next;
        });
      }, 1500);
    }
  }, [planesQuery.data]);

  const copyCode = () => {
    if (roomQuery.data) {
      navigator.clipboard.writeText(roomQuery.data.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!userId) return null;

  const room = roomQuery.data;
  const planes = planesQuery.data ?? [];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <RadarBg />
      <ThemeToggle />

      <div className="relative z-10 px-6 py-8 max-w-3xl mx-auto">
        {/* Header — Control Tower */}
        <div className="flex items-start gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-1 opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--ink)' }}
          >
            <BackIcon />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="heading text-xl font-semibold truncate">Control Tower</h1>
              <SmallPlaneIcon size={20} />
            </div>
            <p className="text-sm mt-0.5" style={{ color: 'var(--ink-muted)' }}>{room?.name ?? 'Loading...'}</p>
            {room && (
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 text-xs transition-all hover:opacity-80"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  <span className="fids-font font-mono tracking-wider">{room.code}</span>
                  <CopyIcon />
                  {copied && <span className="text-[10px]" style={{ color: 'var(--success)' }}>Copied</span>}
                </button>
                <span className={`badge-${room.status === 'active' ? 'active' : room.status === 'paused' ? 'paused' : 'closed'}`}>
                  {room.status}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-muted)' }}>
                  <UsersIcon /> {room.participantCount} passengers
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Feed header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="fids-font text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>
            Incoming Flights ({planes.length})
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
            <span className="fids-font text-[10px]" style={{ color: 'var(--ink-muted)' }}>Radar Active</span>
          </div>
        </div>

        {/* Planes Feed */}
        {planes.length === 0 ? (
          <div className="card text-center py-16">
            <div className="opacity-20 mb-4 flex justify-center">
              <AirplaneIcon size={56} />
            </div>
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Airspace clear -- no incoming flights</p>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)', opacity: 0.6 }}>
              Share code <span className="fids-font font-mono tracking-wider">{room?.code}</span> with passengers
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {planes.map((plane) => {
                const isNew = newPlaneIds.has(plane.id);
                return (
                  <motion.div
                    key={plane.id}
                    initial={isNew ? { x: 300, opacity: 0, scale: 0.7 } : { opacity: 1 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={
                      isNew
                        ? { type: 'spring', stiffness: 60, damping: 12, duration: 0.8 }
                        : { duration: 0.2 }
                    }
                    className="card relative overflow-hidden"
                  >
                    {/* New indicator */}
                    {isNew && (
                      <motion.div
                        className="absolute top-4 right-4 new-indicator"
                        initial={{ scale: 1.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="fids-font text-[10px] font-bold tracking-wider">{plane.id.slice(-5).toUpperCase()}</span>
                        <span className="fids-font text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                          {new Date(plane.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                        {plane.senderName || 'Anonymous'}
                      </span>
                    </div>

                    <p className="text-sm mb-4 leading-relaxed">{plane.content}</p>

                    <div className="flex items-center gap-1.5">
                      {/* Broadcast (coral fill) */}
                      <button
                        onClick={() =>
                          plane.isBroadcasted
                            ? unbroadcastMutation.mutate({ planeId: plane.id })
                            : broadcastMutation.mutate({ planeId: plane.id })
                        }
                        className={`btn-atc-broadcast ${plane.isBroadcasted ? 'active' : ''}`}
                        title={plane.isBroadcasted ? 'Revoke broadcast' : 'Broadcast'}
                      >
                        <BroadcastIcon />
                        <span>{plane.isBroadcasted ? 'On Air' : 'Broadcast'}</span>
                      </button>
                      {/* Pin (orange outline) */}
                      <button
                        onClick={() => pinMutation.mutate({ planeId: plane.id })}
                        className={`btn-atc-hold ${plane.isPinned ? 'active' : ''}`}
                        title={plane.isPinned ? 'Unpin' : 'Pin'}
                      >
                        <PinIcon />
                        <span>Pin</span>
                      </button>
                      {/* Remove (dark outline) */}
                      <button
                        onClick={() => removeMutation.mutate({ planeId: plane.id })}
                        className="btn-atc-reject"
                        title="Remove"
                      >
                        <TrashIcon />
                        <span>Remove</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
