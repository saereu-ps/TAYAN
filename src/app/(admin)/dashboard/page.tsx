'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { useEffect } from 'react';
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
        <rect x="42" y="25" width="3" height="4" rx="1.5"/>
        <rect x="56" y="25" width="3" height="4" rx="1.5"/>
        <rect x="70" y="25" width="3" height="4" rx="1.5"/>
        <rect x="84" y="25" width="3" height="4" rx="1.5"/>
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

function DashboardBg() {
  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
        {/* Sky blue */}
        <rect width="1200" height="800" fill="#5b9bd5"/>

        {/* Cloud layer at bottom — cream filled shapes */}
        <ellipse cx="150" cy="720" rx="200" ry="60" fill="#f5e8c8" opacity="0.6"/>
        <ellipse cx="400" cy="740" rx="250" ry="70" fill="#f5e8c8" opacity="0.5"/>
        <ellipse cx="700" cy="730" rx="280" ry="65" fill="#f5e8c8" opacity="0.55"/>
        <ellipse cx="1000" cy="720" rx="220" ry="55" fill="#f5e8c8" opacity="0.5"/>
        <ellipse cx="300" cy="760" rx="300" ry="80" fill="#f5e8c8" opacity="0.7"/>
        <ellipse cx="800" cy="770" rx="350" ry="90" fill="#f5e8c8" opacity="0.65"/>

        {/* Tiny airplane silhouettes scattered — dark teal fill */}
        <g fill="#2a5a6a" opacity="0.2">
          <g transform="translate(200, 150) scale(0.4) rotate(-10)">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
          <g transform="translate(900, 200) scale(0.3) rotate(5)">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
          <g transform="translate(600, 100) scale(0.25) rotate(-5)">
            <path d="M58 30H42L30 18H26L30 30H16L12 26H8L12 32L8 38H12L16 34H30L26 46H30L42 34H58C60 34 62 33 62 32C62 31 60 30 58 30Z"/>
          </g>
          <g transform="translate(1050, 350) scale(0.35) rotate(8)">
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
      <DashboardBg />
      <ThemeToggle />

      <div className="relative z-10 px-6 py-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading text-xl font-semibold flex items-center gap-3 text-white drop-shadow-sm">
              Flight Schedule
              <SmallPlaneIcon size={20} />
            </h1>
            <p className="text-xs mt-1 text-white/70">Welcome, Captain {userName}</p>
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
              className="p-2 rounded-lg transition-all text-white/60 hover:text-white"
              style={{ border: '1px solid rgba(255,255,255,0.3)' }}
              title="Logout"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="card text-center py-4">
            <p className="text-2xl font-semibold" style={{ color: 'var(--teal)' }}>{rooms.length}</p>
            <p className="fids-font text-[10px] mt-1 uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>Total Flights</p>
          </div>
          <div className="card text-center py-4">
            <p className="text-2xl font-semibold" style={{ color: 'var(--success)' }}>{activeCount}</p>
            <p className="fids-font text-[10px] mt-1 uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>Boarding</p>
          </div>
          <div className="card text-center py-4">
            <p className="text-2xl font-semibold" style={{ color: 'var(--orange)' }}>{totalParticipants}</p>
            <p className="fids-font text-[10px] mt-1 uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>Passengers</p>
          </div>
        </div>

        {/* Room List — Boarding pass style cards */}
        {rooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-16"
          >
            <div className="opacity-20 mb-4 flex justify-center">
              <AirplaneIcon size={56} />
            </div>
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>No flights scheduled</p>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)', opacity: 0.6 }}>Schedule your first flight to get started</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card cursor-pointer relative overflow-hidden hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/admin/${room.id}`)}
                style={{ borderLeft: '4px solid var(--accent)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="fids-font text-sm font-bold tracking-wider" style={{ color: 'var(--teal)' }}>
                      {room.code}
                    </span>
                    <span className="text-sm font-medium truncate">{room.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge-${room.status === 'active' ? 'active' : room.status === 'paused' ? 'paused' : 'closed'}`}>
                      {room.status === 'active' ? 'Boarding' : room.status === 'paused' ? 'Delayed' : 'Landed'}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-muted)' }}>
                      <UsersIcon /> {room.participantCount}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Cancel this flight?')) {
                          deleteMutation.mutate({ id: room.id });
                        }
                      }}
                      className="p-1 rounded opacity-30 hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--error)' }}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
