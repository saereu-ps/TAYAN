'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { useUser, useClerk } from '@clerk/nextjs';
import { useEffect } from 'react';
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
  const { theme } = useTheme();
  const isNight = theme === 'night';

  const skyColor = isNight ? '#1a2040' : '#5b9bd5';
  const cloudColor = isNight ? '#2a3a5a' : '#f5e8c8';
  const planeColor = isNight ? '#2a3a5a' : '#2a5a6a';

  return (
    <div className="svg-bg">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
        <rect width="1200" height="800" fill={skyColor}/>

        {/* Stars (night only) */}
        {isNight && (
          <g>
            <circle cx="80" cy="60" r="1.5" fill="#ffffff" opacity="0.5"/>
            <circle cx="200" cy="100" r="1" fill="#ffffff" opacity="0.4"/>
            <circle cx="350" cy="50" r="2" fill="#ffffff" opacity="0.6"/>
            <circle cx="500" cy="80" r="1" fill="#ffffff" opacity="0.3"/>
            <circle cx="650" cy="40" r="1.5" fill="#ffffff" opacity="0.5"/>
            <circle cx="800" cy="90" r="2" fill="#ffffff" opacity="0.4"/>
            <circle cx="950" cy="60" r="1" fill="#ffffff" opacity="0.7"/>
            <circle cx="1100" cy="110" r="1.5" fill="#ffffff" opacity="0.5"/>
            <circle cx="150" cy="180" r="1" fill="#ffffff" opacity="0.3"/>
            <circle cx="400" cy="200" r="1.5" fill="#ffffff" opacity="0.4"/>
            <circle cx="700" cy="150" r="2" fill="#ffffff" opacity="0.5"/>
            <circle cx="1000" cy="180" r="1" fill="#ffffff" opacity="0.6"/>
            <circle cx="250" cy="300" r="1.5" fill="#ffffff" opacity="0.3"/>
            <circle cx="550" cy="280" r="1" fill="#ffffff" opacity="0.4"/>
            <circle cx="850" cy="250" r="2" fill="#ffffff" opacity="0.5"/>
            <circle cx="1050" cy="300" r="1.5" fill="#ffffff" opacity="0.3"/>
          </g>
        )}

        {/* Cloud layer at bottom */}
        <ellipse cx="150" cy="720" rx="200" ry="60" fill={cloudColor} opacity="0.6"/>
        <ellipse cx="400" cy="740" rx="250" ry="70" fill={cloudColor} opacity="0.5"/>
        <ellipse cx="700" cy="730" rx="280" ry="65" fill={cloudColor} opacity="0.55"/>
        <ellipse cx="1000" cy="720" rx="220" ry="55" fill={cloudColor} opacity="0.5"/>
        <ellipse cx="300" cy="760" rx="300" ry="80" fill={cloudColor} opacity="0.7"/>
        <ellipse cx="800" cy="770" rx="350" ry="90" fill={cloudColor} opacity="0.65"/>

        {/* Tiny airplane silhouettes */}
        <g fill={planeColor} opacity="0.2">
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
  const { userId, userName, userEmail, logout } = useUserStore();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut } = useClerk();

  // Use Clerk user info if available, fallback to local store
  const displayName = clerkUser?.firstName || clerkUser?.username || userName || 'Captain';
  const displayEmail = clerkUser?.primaryEmailAddress?.emailAddress || userEmail || '';
  const effectiveUserId = clerkUser?.id || userId;

  // Wait for Clerk to finish loading before redirecting
  useEffect(() => {
    if (clerkLoaded && !clerkUser && !userId) {
      router.push('/login');
    }
  }, [clerkLoaded, clerkUser, userId, router]);

  // Show loading while Clerk is initializing
  if (!clerkLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#5b9bd5' }}>
        <p className="text-white/70 text-sm">Loading...</p>
      </div>
    );
  }

  const roomsQuery = trpc.room.list.useQuery(
    { ownerId: effectiveUserId ?? '' },
    { enabled: !!effectiveUserId, refetchInterval: 5000 },
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

      <div className="relative z-10 px-6 py-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading text-xl font-semibold flex items-center gap-3 text-white drop-shadow-sm">
              Flight Schedule
              <SmallPlaneIcon size={20} />
            </h1>
            <p className="text-xs mt-1 text-white/70">Welcome, Captain {displayName}</p>
            {displayEmail && <p className="text-[10px] mt-0.5 text-white/50">{displayEmail}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/create')}
              className="btn-primary flex items-center gap-2"
            >
              <PlusIcon /> Schedule Flight
            </button>
            <button
              onClick={() => { signOut(); logout(); router.push('/'); }}
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

        {/* Room List */}
        {rooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-16"
          >
            <div className="opacity-20 mb-4 flex justify-center">
              <AirplaneIcon size={100} />
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
