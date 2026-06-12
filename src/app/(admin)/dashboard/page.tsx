'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { useEffect } from 'react';

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function RoomIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 3v18M3 9h18" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
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

export default function DashboardPage() {
  const router = useRouter();
  const { userId, userName, logout } = useUserStore();

  useEffect(() => {
    if (!userId) router.push('/login');
  }, [userId, router]);

  const roomsQuery = trpc.room.list.useQuery(
    { ownerId: userId ?? '' },
    { enabled: !!userId, refetchInterval: 5000 },
  );

  const deleteMutation = trpc.room.delete.useMutation({
    onSuccess: () => roomsQuery.refetch(),
  });

  if (!userId) return null;

  const rooms = roomsQuery.data ?? [];

  return (
    <div className="min-h-screen px-6 py-8 max-w-2xl mx-auto" style={{ backgroundColor: 'var(--cream)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium" style={{ color: 'var(--ink)' }}>
            Your Rooms
          </h1>
          <p className="text-xs mt-1 opacity-60">Welcome, {userName}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/create')}
            className="btn-vermillion flex items-center gap-2"
          >
            <PlusIcon /> New Room
          </button>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="p-2 rounded-md opacity-50 hover:opacity-100 transition-opacity"
            title="Logout"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>

      {/* Room List */}
      {rooms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <div className="opacity-30 mb-4 flex justify-center">
            <RoomIcon />
          </div>
          <p className="text-sm opacity-60">No rooms yet</p>
          <p className="text-xs opacity-40 mt-1">Create your first room to get started</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {rooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card flex items-center justify-between cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => router.push(`/admin/${room.id}`)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium truncate">{room.name}</h3>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor:
                        room.status === 'active'
                          ? 'rgba(34, 197, 94, 0.1)'
                          : room.status === 'paused'
                          ? 'rgba(234, 179, 8, 0.1)'
                          : 'rgba(156, 163, 175, 0.1)',
                      color:
                        room.status === 'active'
                          ? '#16a34a'
                          : room.status === 'paused'
                          ? '#ca8a04'
                          : '#6b7280',
                    }}
                  >
                    {room.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs opacity-50">
                    Code: <span className="font-mono tracking-wider">{room.code}</span>
                  </span>
                  <span className="text-xs opacity-50">
                    {room.participantCount} joined
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this room?')) {
                    deleteMutation.mutate({ id: room.id });
                  }
                }}
                className="p-2 rounded opacity-30 hover:opacity-70 transition-opacity"
                style={{ color: 'var(--vermillion)' }}
              >
                <TrashIcon />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
