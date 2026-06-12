'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
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

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function BroadcastIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4" />
      <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
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

function AdminBg() {
  return (
    <div className="svg-bg opacity-[0.03]">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        {/* Paper planes scattered */}
        <g stroke="currentColor" strokeWidth="0.5" fill="none">
          <path d="M100 100 L130 90 L120 115 L112 105 L100 100Z"/>
          <path d="M300 200 L320 195 L315 210 L310 205 L300 200Z"/>
          <path d="M900 150 L930 140 L920 165 L912 155 L900 150Z"/>
          <path d="M700 300 L720 295 L715 310 L710 305 L700 300Z"/>
          <path d="M1050 250 L1070 245 L1065 260 L1060 255 L1050 250Z"/>
          <path d="M200 500 L220 495 L215 510 L210 505 L200 500Z"/>
          <path d="M800 450 L820 445 L815 460 L810 455 L800 450Z"/>
          <path d="M500 100 L520 95 L515 110 L510 105 L500 100Z"/>
          <path d="M1100 400 L1120 395 L1115 410 L1110 405 L1100 400Z"/>
        </g>
        {/* Clouds */}
        <g stroke="currentColor" strokeWidth="0.3" fill="none">
          <path d="M50 150 Q80 130 110 140 Q130 125 160 135 Q180 130 190 150"/>
          <path d="M400 80 Q420 65 440 75 Q460 60 480 70 Q500 65 510 80"/>
          <path d="M750 200 Q780 185 800 195 Q820 180 840 190"/>
          <path d="M1000 100 Q1020 85 1040 95 Q1060 80 1080 90 Q1100 85 1110 100"/>
          <path d="M200 350 Q220 335 240 345 Q260 330 280 340"/>
          <path d="M600 450 Q620 435 640 445 Q660 430 680 440"/>
        </g>
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

  // Track new planes for animation
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
      <AdminBg />
      <ThemeToggle />

      <div className="relative z-10 px-6 py-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-1 opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--ink)' }}
          >
            <BackIcon />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="heading text-xl font-semibold truncate">{room?.name ?? 'Loading...'}</h1>
            {room && (
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 text-xs transition-all hover:opacity-80"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  <span className="font-mono tracking-wider">{room.code}</span>
                  <CopyIcon />
                  {copied && <span className="text-[10px]" style={{ color: 'var(--teal)' }}>Copied</span>}
                </button>
                <span className={`badge-${room.status === 'active' ? 'active' : room.status === 'paused' ? 'paused' : 'closed'}`}>
                  {room.status}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-muted)' }}>
                  <UsersIcon /> {room.participantCount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Feed header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>
            Incoming Planes ({planes.length})
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--teal)' }} />
            <span className="text-[10px]" style={{ color: 'var(--ink-muted)' }}>Live</span>
          </div>
        </div>

        {/* Planes Feed */}
        {planes.length === 0 ? (
          <div className="card text-center py-16">
            <div className="opacity-20 mb-4 flex justify-center" style={{ color: 'var(--ink)' }}>
              <PlaneIcon size={48} />
            </div>
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Waiting for paper planes...</p>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)', opacity: 0.6 }}>
              Share code <span className="font-mono tracking-wider">{room?.code}</span> with participants
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
                    initial={isNew ? { x: 200, y: -60, opacity: 0, rotate: -15, scale: 0.6 } : { opacity: 1 }}
                    animate={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={
                      isNew
                        ? { type: 'spring', stiffness: 60, damping: 12, duration: 0.8 }
                        : { duration: 0.2 }
                    }
                    className="card relative"
                    style={{
                      borderLeft: plane.isPinned ? '3px solid var(--amber)' : undefined,
                    }}
                  >
                    {/* Landing plane icon for new messages */}
                    {isNew && (
                      <motion.div
                        className="absolute -top-3 -right-3"
                        initial={{ scale: 1.5, opacity: 1, rotate: -20 }}
                        animate={{ scale: 0, opacity: 0, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        style={{ color: 'var(--amber)' }}
                      >
                        <PlaneIcon size={24} />
                      </motion.div>
                    )}

                    <p className="text-sm mb-3 leading-relaxed">{plane.content}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                          {plane.senderName || 'Anonymous'}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--ink-muted)', opacity: 0.5 }}>
                          {new Date(plane.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            plane.isBroadcasted
                              ? unbroadcastMutation.mutate({ planeId: plane.id })
                              : broadcastMutation.mutate({ planeId: plane.id })
                          }
                          className={`btn-pill ${plane.isBroadcasted ? 'active' : ''}`}
                          title={plane.isBroadcasted ? 'Unbroadcast' : 'Broadcast'}
                        >
                          <BroadcastIcon />
                          <span>{plane.isBroadcasted ? 'On Air' : 'Broadcast'}</span>
                        </button>
                        <button
                          onClick={() => pinMutation.mutate({ planeId: plane.id })}
                          className={`btn-pill ${plane.isPinned ? 'active' : ''}`}
                          title={plane.isPinned ? 'Unpin' : 'Pin'}
                        >
                          <PinIcon />
                        </button>
                        <button
                          onClick={() => removeMutation.mutate({ planeId: plane.id })}
                          className="btn-pill hover:!border-red-400 hover:!text-red-400"
                          title="Remove"
                        >
                          <TrashIcon />
                        </button>
                      </div>
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
