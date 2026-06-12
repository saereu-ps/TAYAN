'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { useEffect } from 'react';
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

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
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

function UsersIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function BangkokMapBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        {/* Grid pattern like Bangkok streets */}
        <g opacity="0.04" stroke="currentColor" strokeWidth="0.3">
          {/* Horizontal roads */}
          <line x1="0" y1="100" x2="1200" y2="100"/>
          <line x1="0" y1="200" x2="1200" y2="200"/>
          <line x1="0" y1="350" x2="1200" y2="350"/>
          <line x1="0" y1="500" x2="1200" y2="500"/>
          <line x1="0" y1="650" x2="1200" y2="650"/>
          {/* Vertical roads */}
          <line x1="150" y1="0" x2="150" y2="800"/>
          <line x1="350" y1="0" x2="350" y2="800"/>
          <line x1="550" y1="0" x2="550" y2="800"/>
          <line x1="750" y1="0" x2="750" y2="800"/>
          <line x1="950" y1="0" x2="950" y2="800"/>
          {/* Diagonal (like Bangkok sois) */}
          <line x1="200" y1="100" x2="350" y2="200"/>
          <line x1="600" y1="200" x2="750" y2="350"/>
          <line x1="400" y1="500" x2="550" y2="650"/>
          <line x1="800" y1="350" x2="950" y2="500"/>
        </g>

        {/* Landmark dots */}
        <g opacity="0.08" fill="currentColor">
          <circle cx="350" cy="200" r="4"/>
          <circle cx="550" cy="350" r="5"/>
          <circle cx="750" cy="500" r="4"/>
          <circle cx="150" cy="350" r="3"/>
          <circle cx="950" cy="200" r="4"/>
          <circle cx="550" cy="650" r="3"/>
          <circle cx="350" cy="500" r="3"/>
        </g>

        {/* River curve */}
        <path d="M400 0 Q420 100 380 200 Q340 350 400 500 Q450 650 380 800" stroke="currentColor" strokeWidth="0.5" opacity="0.06" fill="none"/>
      </svg>
    </div>
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
  const activeCount = rooms.filter(r => r.status === 'active').length;
  const totalParticipants = rooms.reduce((sum, r) => sum + (r.participantCount || 0), 0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BangkokMapBg />
      <ThemeToggle />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading text-xl font-semibold">Your Rooms</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>Welcome, {userName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/create')}
              className="btn-primary flex items-center gap-2"
            >
              <PlusIcon /> New Room
            </button>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="p-2 rounded-lg transition-all"
              style={{ color: 'var(--ink-muted)', border: '1px solid var(--border)' }}
              title="Logout"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="card text-center py-4">
            <p className="text-2xl font-semibold" style={{ color: 'var(--amber)' }}>{rooms.length}</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--ink-muted)' }}>Total Rooms</p>
          </div>
          <div className="card text-center py-4">
            <p className="text-2xl font-semibold" style={{ color: 'var(--teal)' }}>{activeCount}</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--ink-muted)' }}>Active</p>
          </div>
          <div className="card text-center py-4">
            <p className="text-2xl font-semibold">{totalParticipants}</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--ink-muted)' }}>Participants</p>
          </div>
        </div>

        {/* Room List — Boarding Pass style */}
        {rooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-16"
          >
            <div className="opacity-20 mb-4 flex justify-center">
              <PlaneIcon size={48} />
            </div>
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>No rooms yet</p>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)', opacity: 0.6 }}>Create your first room to get started</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-boarding-pass cursor-pointer"
                onClick={() => router.push(`/admin/${room.id}`)}
              >
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex-1 min-w-0 pl-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold truncate">{room.name}</h3>
                      <span className={`badge-${room.status === 'active' ? 'active' : room.status === 'paused' ? 'paused' : 'closed'}`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-[10px] font-mono tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                        {room.code}
                      </span>
                      <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                        <UsersIcon /> {room.participantCount} joined
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
                    className="p-2 rounded-lg opacity-30 hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--error)' }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
