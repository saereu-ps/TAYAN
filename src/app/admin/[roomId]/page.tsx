'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle } from '../../theme-provider';

// --- Types ---
interface PaperPlane {
  id: string;
  content: string;
  senderName?: string | null;
  createdAt: string | Date;
  isBroadcasted?: boolean;
  isPinned?: boolean;
}

// --- Constants ---
const GATES = [
  { id: 1, x: 10, y: 12 },
  { id: 2, x: 25, y: 12 },
  { id: 3, x: 40, y: 12 },
  { id: 4, x: 55, y: 12 },
  { id: 5, x: 10, y: 78 },
  { id: 6, x: 25, y: 78 },
  { id: 7, x: 40, y: 78 },
  { id: 8, x: 55, y: 78 },
];

const COLORS = {
  tarmac: '#4a6070',
  runway: '#3a5060',
  runwayMarking: '#ffffff',
  grass: '#5b9bd5',
  gateBuilding: '#2a5a6a',
  planeBody: '#f0ebe0',
  planeTail: '#4b2d8e',
  planeAccent: '#c4a44e',
  unreadGlow: '#e87060',
  cardBg: 'rgba(255,255,255,0.97)',
  text: '#1a2a3a',
};

// --- SVG Icons ---
function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
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

function BroadcastIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
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

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// --- Top-Down Plane SVG ---
function PlaneTopDown({ isRead, size = 40 }: { isRead: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Body */}
      <ellipse cx="20" cy="20" rx="4" ry="16" fill={isRead ? '#c8c4bc' : '#f0ebe0'} />
      {/* Wings */}
      <path d="M20 16 L6 20 L20 22Z" fill={isRead ? '#8a8680' : '#2a5a6a'} />
      <path d="M20 16 L34 20 L20 22Z" fill={isRead ? '#8a8680' : '#2a5a6a'} />
      {/* Tail */}
      <path d="M20 34 L16 38 L20 36 L24 38Z" fill={isRead ? '#6a6060' : '#4b2d8e'} />
      {/* Tail wings */}
      <path d="M20 33 L14 35 L20 34Z" fill={isRead ? '#8a8680' : '#2a5a6a'} />
      <path d="M20 33 L26 35 L20 34Z" fill={isRead ? '#8a8680' : '#2a5a6a'} />
      {/* Gold stripe */}
      {!isRead && <line x1="20" y1="6" x2="20" y2="34" stroke="#c4a44e" strokeWidth="0.8" />}
      {/* Cockpit */}
      <ellipse cx="20" cy="6" rx="2.5" ry="3" fill={isRead ? '#8a8a8a' : '#5b9bd5'} />
    </svg>
  );
}

// --- Tarmac Layout (Background) ---
function TarmacLayout() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: COLORS.tarmac }}>
      {/* Grass border top */}
      <div className="absolute top-0 left-0 right-0 h-[3%]" style={{ background: COLORS.grass, opacity: 0.3 }} />
      {/* Grass border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3%]" style={{ background: COLORS.grass, opacity: 0.3 }} />

      {/* Gate buildings - top row */}
      {GATES.filter(g => g.y < 50).map(gate => (
        <div
          key={`building-${gate.id}`}
          className="absolute flex flex-col items-center"
          style={{ left: `${gate.x}%`, top: `${gate.y - 6}%`, transform: 'translateX(-50%)' }}
        >
          <div
            className="rounded-sm text-[9px] font-bold text-white px-2 py-0.5 tracking-wider"
            style={{ background: COLORS.gateBuilding }}
          >
            G{gate.id}
          </div>
          {/* T-shaped marking */}
          <div className="w-[2px] h-3 mt-0.5" style={{ background: COLORS.runwayMarking, opacity: 0.5 }} />
          <div className="w-6 h-[2px]" style={{ background: COLORS.runwayMarking, opacity: 0.5 }} />
        </div>
      ))}

      {/* Gate buildings - bottom row */}
      {GATES.filter(g => g.y >= 50).map(gate => (
        <div
          key={`building-${gate.id}`}
          className="absolute flex flex-col items-center"
          style={{ left: `${gate.x}%`, bottom: `${100 - gate.y - 6}%`, transform: 'translateX(-50%)' }}
        >
          {/* T-shaped marking (inverted) */}
          <div className="w-6 h-[2px]" style={{ background: COLORS.runwayMarking, opacity: 0.5 }} />
          <div className="w-[2px] h-3 mb-0.5" style={{ background: COLORS.runwayMarking, opacity: 0.5 }} />
          <div
            className="rounded-sm text-[9px] font-bold text-white px-2 py-0.5 tracking-wider"
            style={{ background: COLORS.gateBuilding }}
          >
            G{gate.id}
          </div>
        </div>
      ))}

      {/* Taxiway - top */}
      <div
        className="absolute left-[5%] right-[30%] h-[2px]"
        style={{ top: '35%', background: COLORS.runwayMarking, opacity: 0.2 }}
      />
      {/* Taxiway - bottom */}
      <div
        className="absolute left-[5%] right-[30%] h-[2px]"
        style={{ top: '62%', background: COLORS.runwayMarking, opacity: 0.2 }}
      />

      {/* Runway */}
      <div
        className="absolute left-[5%] right-[5%]"
        style={{ top: '44%', height: '12%', background: COLORS.runway, borderRadius: '4px' }}
      >
        {/* Center dashes */}
        <div className="absolute top-1/2 left-[3%] right-[3%] flex items-center justify-between -translate-y-1/2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="h-[2px] flex-1 mx-1"
              style={{ background: COLORS.runwayMarking, opacity: 0.7 }}
            />
          ))}
        </div>
        {/* Runway threshold markings */}
        <div className="absolute left-[3%] top-[20%] bottom-[20%] flex flex-col justify-between">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-4 h-[2px]" style={{ background: COLORS.runwayMarking, opacity: 0.5 }} />
          ))}
        </div>
        <div className="absolute right-[3%] top-[20%] bottom-[20%] flex flex-col justify-between">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-4 h-[2px]" style={{ background: COLORS.runwayMarking, opacity: 0.5 }} />
          ))}
        </div>
      </div>

      {/* Wind sock indicator */}
      <div className="absolute right-[8%] top-[6%] flex items-center gap-1">
        <div className="w-[2px] h-5 bg-white opacity-40" />
        <div className="w-3 h-2 opacity-40" style={{ background: COLORS.unreadGlow, clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }} />
      </div>
    </div>
  );
}

// --- Message Modal ---
function MessageModal({
  plane,
  onClose,
  onBroadcast,
  onUnbroadcast,
  onPin,
  onRemove,
}: {
  plane: PaperPlane;
  onClose: () => void;
  onBroadcast: () => void;
  onUnbroadcast: () => void;
  onPin: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <motion.div
        className="relative w-full max-w-md rounded-2xl shadow-2xl p-6"
        style={{ background: COLORS.cardBg, color: COLORS.text }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 opacity-40 hover:opacity-100 transition-opacity"
        >
          <CloseIcon />
        </button>

        {/* Flight ID */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold tracking-wider font-mono" style={{ color: COLORS.gateBuilding }}>
            FLIGHT {plane.id.slice(-6).toUpperCase()}
          </span>
        </div>

        {/* Sender & Time */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs" style={{ opacity: 0.6 }}>
            {plane.senderName || 'Anonymous Passenger'}
          </span>
          <span className="text-xs" style={{ opacity: 0.4 }}>
            {new Date(plane.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Message content */}
        <div className="rounded-xl p-4 mb-5" style={{ background: '#f5f3ef' }}>
          <p className="text-sm leading-relaxed" style={{ color: COLORS.text }}>
            {plane.content}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={plane.isBroadcasted ? onUnbroadcast : onBroadcast}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: plane.isBroadcasted ? COLORS.unreadGlow : 'transparent',
              color: plane.isBroadcasted ? '#fff' : COLORS.unreadGlow,
              border: `1.5px solid ${COLORS.unreadGlow}`,
            }}
          >
            <BroadcastIcon />
            {plane.isBroadcasted ? 'On Air' : 'Broadcast'}
          </button>

          <button
            onClick={onPin}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: plane.isPinned ? '#e89040' : 'transparent',
              color: plane.isPinned ? '#fff' : '#e89040',
              border: '1.5px solid #e89040',
            }}
          >
            <PinIcon />
            {plane.isPinned ? 'Pinned' : 'Pin'}
          </button>

          <button
            onClick={onRemove}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: 'transparent',
              color: '#c04040',
              border: '1.5px solid #c04040',
            }}
          >
            <TrashIcon />
            Remove
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Page Component ---
export default function AdminRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  const { userId } = useUserStore();

  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [gateAssignments, setGateAssignments] = useState<Map<string, number>>(new Map());
  const [selectedPlane, setSelectedPlane] = useState<PaperPlane | null>(null);
  const [landingPlanes, setLandingPlanes] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const prevPlaneIdsRef = useRef<Set<string>>(new Set());
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
    onSuccess: () => {
      planesQuery.refetch();
      if (selectedPlane) setSelectedPlane(null);
    },
  });

  // Assign gates and detect new planes
  const assignGate = useCallback((planeId: string, currentAssignments: Map<string, number>): number => {
    const occupiedGates = new Set(currentAssignments.values());
    for (const gate of GATES) {
      if (!occupiedGates.has(gate.id)) {
        return gate.id;
      }
    }
    // Overflow: cycle through gates
    return (currentAssignments.size % GATES.length) + 1;
  }, []);

  useEffect(() => {
    if (!planesQuery.data) return;

    const currentIds = new Set(planesQuery.data.map((p) => p.id));

    if (initialLoadRef.current) {
      // On first load, assign all planes to gates (no animation)
      const assignments = new Map<string, number>();
      planesQuery.data.forEach((plane) => {
        const gateId = assignGate(plane.id, assignments);
        assignments.set(plane.id, gateId);
      });
      setGateAssignments(assignments);
      prevPlaneIdsRef.current = currentIds;
      initialLoadRef.current = false;
      return;
    }

    // Detect new planes
    const newIds: string[] = [];
    currentIds.forEach((id) => {
      if (!prevPlaneIdsRef.current.has(id)) {
        newIds.push(id);
      }
    });

    // Detect removed planes
    const removedIds: string[] = [];
    prevPlaneIdsRef.current.forEach((id) => {
      if (!currentIds.has(id)) {
        removedIds.push(id);
      }
    });

    if (newIds.length > 0 || removedIds.length > 0) {
      setGateAssignments((prev) => {
        const next = new Map(prev);
        // Free gates from removed planes
        removedIds.forEach((id) => next.delete(id));
        // Assign new planes to gates
        newIds.forEach((id) => {
          const gateId = assignGate(id, next);
          next.set(id, gateId);
        });
        return next;
      });

      // Trigger landing animation for new planes
      if (newIds.length > 0) {
        setLandingPlanes((prev) => {
          const next = new Set(prev);
          newIds.forEach((id) => next.add(id));
          return next;
        });
        // Clear landing state after animation
        setTimeout(() => {
          setLandingPlanes((prev) => {
            const next = new Set(prev);
            newIds.forEach((id) => next.delete(id));
            return next;
          });
        }, 2500);
      }
    }

    prevPlaneIdsRef.current = currentIds;
  }, [planesQuery.data, assignGate]);

  const handlePlaneClick = (plane: PaperPlane) => {
    setSelectedPlane(plane);
    setReadIds((prev) => new Set([...prev, plane.id]));
  };

  const copyCode = () => {
    if (roomQuery.data) {
      navigator.clipboard.writeText(roomQuery.data.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!userId) return null;

  const room = roomQuery.data;
  const planes = (planesQuery.data ?? []) as PaperPlane[];

  return (
    <div className="h-screen w-screen relative overflow-hidden select-none">
      {/* Tarmac Background */}
      <TarmacLayout />

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle />
      </div>

      {/* Header Bar */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-3"
        style={{ background: 'rgba(26,42,58,0.85)', backdropFilter: 'blur(8px)' }}
      >
        <button
          onClick={() => router.push('/dashboard')}
          className="text-white/60 hover:text-white transition-colors"
        >
          <BackIcon />
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h1 className="text-white text-sm font-semibold tracking-wide truncate">
            Control Tower
          </h1>
          {room && (
            <>
              <span className="text-white/30">|</span>
              <span className="text-white/80 text-xs truncate">{room.name}</span>
              <span className="text-white/30">|</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
              >
                <span className="font-mono text-xs tracking-wider">{room.code}</span>
                <CopyIcon />
              </button>
              {copied && <span className="text-[10px] text-green-400">Copied</span>}
              <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                room.status === 'active' ? 'bg-green-500/20 text-green-400' :
                room.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {room.status}
              </span>
            </>
          )}
        </div>

        {room && (
          <div className="flex items-center gap-1.5 text-white/60 text-xs">
            <UsersIcon />
            <span>{room.participantCount}</span>
          </div>
        )}

        {/* Plane count */}
        <div className="flex items-center gap-1.5 text-white/60 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>{planes.length} flights</span>
        </div>
      </div>

      {/* Planes on the tarmac */}
      <div className="absolute inset-0 z-10" style={{ top: '48px' }}>
        <AnimatePresence>
          {planes.map((plane) => {
            const gateId = gateAssignments.get(plane.id);
            if (!gateId) return null;
            const gate = GATES.find((g) => g.id === gateId);
            if (!gate) return null;

            const isRead = readIds.has(plane.id);
            const isLanding = landingPlanes.has(plane.id);

            return (
              <motion.div
                key={plane.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${gate.x}%`,
                  top: `${gate.y}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity: isRead ? 0.5 : 1,
                }}
                initial={isLanding ? { x: '80vw', y: '50%', scale: 1.2, rotate: -90 } : { scale: 1, rotate: 0 }}
                animate={{ x: 0, y: 0, scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={
                  isLanding
                    ? { duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }
                    : { duration: 0.3 }
                }
                onClick={() => handlePlaneClick(plane)}
                whileHover={{ scale: 1.15 }}
              >
                {/* Unread glow */}
                {!isRead && (
                  <motion.div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                    style={{ background: COLORS.unreadGlow }}
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                {/* Plane SVG */}
                <PlaneTopDown isRead={isRead} size={38} />
                {/* Flight label */}
                <div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold tracking-wider whitespace-nowrap"
                  style={{ color: isRead ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)' }}
                >
                  {plane.id.slice(-4).toUpperCase()}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {planes.length === 0 && !planesQuery.isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="opacity-30">
            <PlaneTopDown isRead={false} size={80} />
          </div>
          <p className="text-white/40 text-sm mt-4 font-mono tracking-wide">
            Airspace clear -- awaiting arrivals
          </p>
          {room && (
            <p className="text-white/25 text-xs mt-1 font-mono">
              Share code {room.code} with passengers
            </p>
          )}
        </div>
      )}

      {/* Message Modal */}
      <AnimatePresence>
        {selectedPlane && (
          <MessageModal
            plane={selectedPlane}
            onClose={() => setSelectedPlane(null)}
            onBroadcast={() => {
              broadcastMutation.mutate({ planeId: selectedPlane.id });
              setSelectedPlane(null);
            }}
            onUnbroadcast={() => {
              unbroadcastMutation.mutate({ planeId: selectedPlane.id });
              setSelectedPlane(null);
            }}
            onPin={() => {
              pinMutation.mutate({ planeId: selectedPlane.id });
              setSelectedPlane(null);
            }}
            onRemove={() => {
              removeMutation.mutate({ planeId: selectedPlane.id });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
