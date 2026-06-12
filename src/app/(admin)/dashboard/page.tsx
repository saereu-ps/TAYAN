'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { useEffect } from 'react';
import { ThemeToggle } from '../../theme-provider';

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

function FlightBoardBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        {/* Large departure board frame */}
        <g opacity="0.08" stroke="currentColor" fill="none" strokeWidth="0.8">
          {/* Board outline */}
          <rect x="50" y="60" width="1100" height="680" rx="6"/>
          {/* Header bar */}
          <rect x="50" y="60" width="1100" height="40" rx="6" fill="rgba(90,154,207,0.05)"/>
          {/* Column headers */}
          <line x1="200" y1="60" x2="200" y2="740"/>
          <line x1="500" y1="60" x2="500" y2="740"/>
          <line x1="720" y1="60" x2="720" y2="740"/>
          <line x1="900" y1="60" x2="900" y2="740"/>
          {/* Rows */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} x1="50" y1={140 + i * 60} x2="1150" y2={140 + i * 60} strokeWidth="0.3"/>
          ))}
        </g>

        {/* Clock */}
        <g opacity="0.1" stroke="currentColor" fill="none" strokeWidth="0.8">
          <circle cx="1100" cy="30" r="18"/>
          <line x1="1100" y1="15" x2="1100" y2="30"/>
          <line x1="1100" y1="30" x2="1110" y2="35"/>
        </g>

        {/* Small airplane decorations */}
        <g opacity="0.06" fill="currentColor">
          <g transform="translate(80, 75) scale(0.4)">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
        </g>
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
      <FlightBoardBg />
      <ThemeToggle />

      <div className="relative z-10 px-6 py-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading text-xl font-semibold flex items-center gap-2">
              Flight Schedule
              <span className="text-lg">✈️</span>
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>Welcome, Captain {userName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/create')}
              className="btn-primary flex items-center gap-2"
            >
              <PlusIcon /> Schedule Flight
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
            <p className="text-2xl font-semibold" style={{ color: 'var(--blue)' }}>{rooms.length}</p>
            <p className="fids-font text-[10px] mt-1 uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>Total Flights</p>
          </div>
          <div className="card text-center py-4">
            <p className="text-2xl font-semibold" style={{ color: 'var(--success)' }}>{activeCount}</p>
            <p className="fids-font text-[10px] mt-1 uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>Boarding</p>
          </div>
          <div className="card text-center py-4">
            <p className="text-2xl font-semibold" style={{ color: 'var(--amber)' }}>{totalParticipants}</p>
            <p className="fids-font text-[10px] mt-1 uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>Passengers</p>
          </div>
        </div>

        {/* Flight Board Table Header */}
        {rooms.length > 0 && (
          <div className="flex items-center px-5 py-2 mb-1 rounded-lg" style={{ background: 'var(--blue-light)' }}>
            <span className="fids-font text-[9px] uppercase tracking-widest font-medium w-20" style={{ color: 'var(--blue)' }}>Flight</span>
            <span className="fids-font text-[9px] uppercase tracking-widest font-medium flex-1" style={{ color: 'var(--blue)' }}>Destination</span>
            <span className="fids-font text-[9px] uppercase tracking-widest font-medium w-20 text-center" style={{ color: 'var(--blue)' }}>Status</span>
            <span className="fids-font text-[9px] uppercase tracking-widest font-medium w-20 text-center" style={{ color: 'var(--blue)' }}>Gate</span>
            <span className="w-10" />
          </div>
        )}

        {/* Room List as Flight Board */}
        {rooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-16"
          >
            <div className="opacity-20 mb-4 flex justify-center">
              <AirplaneIcon size={48} />
            </div>
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>No flights scheduled</p>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)', opacity: 0.6 }}>Schedule your first flight to get started</p>
          </motion.div>
        ) : (
          <div className="card overflow-hidden !p-0">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flight-row cursor-pointer"
                onClick={() => router.push(`/admin/${room.id}`)}
              >
                {/* Flight code */}
                <span className="fids-font text-xs font-bold tracking-wider w-20" style={{ color: 'var(--ink)' }}>
                  {room.code}
                </span>

                {/* Destination (room name) */}
                <span className="flex-1 text-sm font-medium truncate pr-4">
                  {room.name}
                </span>

                {/* Status */}
                <span className="w-20 text-center">
                  <span className={`badge-${room.status === 'active' ? 'active' : room.status === 'paused' ? 'paused' : 'closed'}`}>
                    {room.status === 'active' ? 'Boarding' : room.status === 'paused' ? 'Delayed' : 'Landed'}
                  </span>
                </span>

                {/* Gate (participants) */}
                <span className="w-20 flex items-center justify-center gap-1 text-xs" style={{ color: 'var(--ink-muted)' }}>
                  <UsersIcon /> {room.participantCount}
                </span>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Cancel this flight?')) {
                      deleteMutation.mutate({ id: room.id });
                    }
                  }}
                  className="w-10 flex justify-end p-1 rounded opacity-30 hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--error)' }}
                >
                  <TrashIcon />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
