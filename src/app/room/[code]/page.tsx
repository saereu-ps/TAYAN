'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';

function PlaneIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
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

export default function ParticipantRoomPage() {
  const params = useParams();
  const code = (params.code as string).toUpperCase();
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showFlyAnimation, setShowFlyAnimation] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const roomQuery = trpc.room.getByCode.useQuery(
    { code },
    { enabled: !joined, retry: false },
  );

  const joinMutation = trpc.room.join.useMutation({
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      setJoined(true);
    },
    onError: (err) => setError(err.message),
  });

  const sendMutation = trpc.plane.send.useMutation({
    onSuccess: () => {
      setMessage('');
      // Show fly animation
      setShowFlyAnimation(true);
      setTimeout(() => {
        setShowFlyAnimation(false);
        setIsSending(false);
      }, 1200);
    },
    onError: (err) => {
      setError(err.message);
      setIsSending(false);
    },
  });

  // Get broadcasted messages (polling)
  const broadcastsQuery = trpc.plane.getBroadcasts.useQuery(
    { roomId: roomQuery.data?.id ?? joinMutation.data?.room.id ?? '' },
    {
      enabled: joined && !!(roomQuery.data?.id || joinMutation.data?.room.id),
      refetchInterval: 2000,
    },
  );

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const room = roomQuery.data;
    if (!room) return;
    if (room.identityMode === 'identified' && !name.trim()) {
      setError('Please enter your name');
      return;
    }
    setError('');
    joinMutation.mutate({ code, name: name.trim() || undefined });
  };

  const handleSend = () => {
    if (!message.trim() || isSending) return;
    const roomId = roomQuery.data?.id || joinMutation.data?.room.id;
    if (!roomId) return;
    setIsSending(true);
    setError('');
    sendMutation.mutate({
      roomId,
      content: message.trim(),
      senderName: name || undefined,
      senderSessionId: sessionId,
    });
  };

  const room = roomQuery.data || joinMutation.data?.room;
  const broadcasts = broadcastsQuery.data ?? [];

  // Not joined yet — show join form
  if (!joined) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--cream)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <div className="inline-block mb-3" style={{ color: 'var(--vermillion)' }}>
              <PlaneIcon size={28} />
            </div>
            {roomQuery.isLoading ? (
              <p className="text-sm opacity-60">Finding room...</p>
            ) : roomQuery.isError ? (
              <div>
                <p className="text-sm" style={{ color: 'var(--vermillion)' }}>Room not found</p>
                <p className="text-xs opacity-50 mt-1">Check your code and try again</p>
              </div>
            ) : room ? (
              <>
                <h1 className="text-xl font-medium" style={{ color: 'var(--ink)' }}>
                  {room.name}
                </h1>
                <p className="text-xs opacity-50 mt-1">
                  {room.identityMode === 'anonymous' ? 'Anonymous mode' : 'Identified mode'}
                </p>
              </>
            ) : null}
          </div>

          {room && room.status === 'active' && (
            <form onSubmit={handleJoin} className="card">
              {room.identityMode === 'identified' && (
                <div className="mb-4">
                  <label className="block text-xs font-medium mb-2 opacity-70">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="input-zen"
                    autoFocus
                  />
                </div>
              )}
              {error && (
                <p className="text-xs mb-3" style={{ color: 'var(--vermillion)' }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="btn-vermillion w-full"
                disabled={joinMutation.isPending}
              >
                {joinMutation.isPending ? 'Joining...' : 'Join Room'}
              </button>
            </form>
          )}

          {room && room.status !== 'active' && (
            <div className="card text-center">
              <p className="text-sm opacity-60">This room is currently {room.status}</p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Joined — show composer + broadcasts
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--cream)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div>
            <h1 className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
              {room?.name}
            </h1>
            <p className="text-[10px] opacity-50">
              {name ? `Joined as ${name}` : 'Anonymous'}
            </p>
          </div>
          <div className="flex items-center gap-1 opacity-50">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px]">Live</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full">
        {/* Broadcasts Section */}
        {broadcasts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <BroadcastIcon />
              <span className="text-xs font-medium opacity-70">Shared Messages</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {broadcasts.map((plane) => (
                  <motion.div
                    key={plane.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                    style={{ borderLeft: plane.isPinned ? '3px solid var(--vermillion)' : undefined }}
                  >
                    <p className="text-sm leading-relaxed">{plane.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] opacity-40">
                        {plane.senderName || 'Anonymous'}
                      </span>
                      <span className="text-[10px] opacity-30">
                        {new Date(plane.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {broadcasts.length === 0 && (
          <div className="text-center py-12 opacity-40">
            <p className="text-sm">No shared messages yet</p>
            <p className="text-xs mt-1">Send a paper plane below</p>
          </div>
        )}
      </div>

      {/* Composer — fixed at bottom */}
      <div className="sticky bottom-0 px-6 pb-6 pt-3" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="max-w-2xl mx-auto relative">
          {/* Flying plane animation overlay */}
          <AnimatePresence>
            {showFlyAnimation && (
              <motion.div
                className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
                  animate={{
                    x: [0, 50, 200, 400],
                    y: [0, -20, -80, -200],
                    rotate: [0, -5, -15, -30],
                    scale: [1, 1.1, 0.9, 0.5],
                    opacity: [1, 1, 0.8, 0],
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ color: 'var(--vermillion)' }}
                >
                  <PlaneIcon size={32} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Composer card */}
          <motion.div
            className="paper-texture rounded-lg p-4 relative overflow-hidden"
            style={{ border: '1px solid var(--border)' }}
            animate={isSending ? { scale: 0.95, opacity: 0.7 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={3}
              className="w-full bg-transparent resize-none outline-none text-sm leading-relaxed"
              style={{ color: 'var(--ink)' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSend();
                }
              }}
              disabled={isSending}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] opacity-30">
                {message.length}/1000
              </span>
              <button
                onClick={handleSend}
                disabled={!message.trim() || isSending}
                className="btn-ink flex items-center gap-2 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <PlaneIcon size={14} />
                Send
              </button>
            </div>
          </motion.div>

          {error && (
            <p className="text-xs mt-2" style={{ color: 'var(--vermillion)' }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
