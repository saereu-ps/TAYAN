'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function BroadcastIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 17v5" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1V3H8v3h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function PlaneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
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
      // First load — mark all as seen
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
      // Clear new status after animation
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
    <div className="min-h-screen px-6 py-8 max-w-3xl mx-auto" style={{ backgroundColor: 'var(--cream)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <BackIcon />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium truncate" style={{ color: 'var(--ink)' }}>
            {room?.name ?? 'Loading...'}
          </h1>
          {room && (
            <div className="flex items-center gap-3 mt-0.5">
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
              >
                <span className="font-mono tracking-wider">{room.code}</span>
                <CopyIcon />
                {copied && <span className="text-[10px]" style={{ color: 'var(--vermillion)' }}>Copied</span>}
              </button>
              <span className="text-xs opacity-40">{room.participantCount} participants</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: room.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                  color: room.status === 'active' ? '#16a34a' : '#ca8a04',
                }}
              >
                {room.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Planes Feed */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium opacity-70">
          Incoming Planes ({planes.length})
        </h2>
        <div className="flex items-center gap-1 opacity-50">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px]">Live</span>
        </div>
      </div>

      {planes.length === 0 ? (
        <div className="card text-center py-16">
          <div className="opacity-20 mb-4 flex justify-center">
            <PlaneIcon />
          </div>
          <p className="text-sm opacity-50">Waiting for paper planes...</p>
          <p className="text-xs opacity-30 mt-1">
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
                  initial={isNew ? { x: -200, opacity: 0, rotate: -5 } : { opacity: 1 }}
                  animate={{ x: 0, opacity: 1, rotate: 0 }}
                  exit={{ x: 200, opacity: 0 }}
                  transition={
                    isNew
                      ? { type: 'spring', stiffness: 80, damping: 15, duration: 0.8 }
                      : { duration: 0.2 }
                  }
                  className="card relative"
                  style={{
                    borderLeft: plane.isPinned ? '3px solid var(--vermillion)' : undefined,
                  }}
                >
                  {/* Landing animation indicator */}
                  {isNew && (
                    <motion.div
                      className="absolute -left-2 top-1/2 -translate-y-1/2"
                      initial={{ scale: 1.5, opacity: 1 }}
                      animate={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 1 }}
                      style={{ color: 'var(--vermillion)' }}
                    >
                      <PlaneIcon />
                    </motion.div>
                  )}

                  <p className="text-sm mb-3 leading-relaxed">{plane.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] opacity-40">
                        {plane.senderName || 'Anonymous'}
                      </span>
                      <span className="text-[10px] opacity-30">
                        {new Date(plane.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Broadcast */}
                      <button
                        onClick={() =>
                          plane.isBroadcasted
                            ? unbroadcastMutation.mutate({ planeId: plane.id })
                            : broadcastMutation.mutate({ planeId: plane.id })
                        }
                        className="p-1.5 rounded transition-all"
                        style={{
                          color: plane.isBroadcasted ? 'var(--cream)' : 'var(--ink)',
                          backgroundColor: plane.isBroadcasted ? 'var(--vermillion)' : 'transparent',
                          opacity: plane.isBroadcasted ? 1 : 0.4,
                        }}
                        title={plane.isBroadcasted ? 'Unbroadcast' : 'Broadcast to all'}
                      >
                        <BroadcastIcon />
                      </button>
                      {/* Pin */}
                      <button
                        onClick={() => pinMutation.mutate({ planeId: plane.id })}
                        className="p-1.5 rounded transition-all"
                        style={{
                          color: plane.isPinned ? 'var(--vermillion)' : 'var(--ink)',
                          opacity: plane.isPinned ? 1 : 0.4,
                        }}
                        title={plane.isPinned ? 'Unpin' : 'Pin'}
                      >
                        <PinIcon />
                      </button>
                      {/* Remove */}
                      <button
                        onClick={() => removeMutation.mutate({ planeId: plane.id })}
                        className="p-1.5 rounded opacity-30 hover:opacity-70 transition-opacity"
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
  );
}
