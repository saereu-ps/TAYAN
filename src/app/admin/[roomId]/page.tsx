'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useUserStore } from '@/stores/user-store';
import { ThemeToggle, useTheme } from '../../theme-provider';

// --- Types ---
interface PaperPlane {
  id: string;
  content: string;
  senderName?: string | null;
  createdAt: string | Date;
  isBroadcasted?: boolean;
  isPinned?: boolean;
}

interface Gate {
  id: number;
  x: number;
  y: number;
}

// --- Dynamic Gate Generation (Curved Terminal Layout) ---
function generateGates(capacity: number): Gate[] {
  const gates: Gate[] = [];
  const topCount = Math.ceil(capacity / 2);
  const bottomCount = Math.floor(capacity / 2);

  // Top arc: semicircle from left to right, curving down
  for (let i = 0; i < topCount; i++) {
    const t = topCount > 1 ? i / (topCount - 1) : 0.5;
    const x = 10 + t * 75;
    const y = 10 + Math.sin(t * Math.PI) * 12;
    gates.push({ id: i + 1, x, y });
  }

  // Bottom arc: semicircle from left to right, curving up
  for (let i = 0; i < bottomCount; i++) {
    const t = bottomCount > 1 ? i / (bottomCount - 1) : 0.5;
    const x = 10 + t * 75;
    const y = 82 - Math.sin(t * Math.PI) * 12;
    gates.push({ id: topCount + i + 1, x, y });
  }

  return gates;
}

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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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

function ArrivalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 22h20" />
      <path d="M3.77 10.77L2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L13 11l4-6 1.7.85a2 2 0 0 1 .88 2.6l-5.12 10.24" />
    </svg>
  );
}

// --- Top-Down Plane SVG ---
function PlaneTopDown({ isRead, size = 40 }: { isRead: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <ellipse cx="20" cy="20" rx="4" ry="16" fill={isRead ? '#c8c4bc' : '#f0ebe0'} />
      <path d="M20 16 L6 20 L20 22Z" fill={isRead ? '#8a8680' : '#2a5a6a'} />
      <path d="M20 16 L34 20 L20 22Z" fill={isRead ? '#8a8680' : '#2a5a6a'} />
      <path d="M20 34 L16 38 L20 36 L24 38Z" fill={isRead ? '#6a6060' : '#4b2d8e'} />
      <path d="M20 33 L14 35 L20 34Z" fill={isRead ? '#8a8680' : '#2a5a6a'} />
      <path d="M20 33 L26 35 L20 34Z" fill={isRead ? '#8a8680' : '#2a5a6a'} />
      {!isRead && <line x1="20" y1="6" x2="20" y2="34" stroke="#c4a44e" strokeWidth="0.8" />}
      <ellipse cx="20" cy="6" rx="2.5" ry="3" fill={isRead ? '#8a8a8a' : '#5b9bd5'} />
    </svg>
  );
}

// --- Terminal Building SVG Paths ---
function TerminalBuildings({ gates, capacity, isNight }: { gates: Gate[]; capacity: number; isNight: boolean }) {
  const topCount = Math.ceil(capacity / 2);
  const topGates = gates.slice(0, topCount);
  const bottomGates = gates.slice(topCount);

  const buildPath = (gateSet: Gate[], curveDirection: 'down' | 'up') => {
    if (gateSet.length < 2) return '';
    const first = gateSet[0];
    const last = gateSet[gateSet.length - 1];
    const midX = (first.x + last.x) / 2;
    const curveAmount = curveDirection === 'down' ? 8 : -8;
    const midY = ((first.y + last.y) / 2) + curveAmount;
    return `M ${first.x} ${first.y} Q ${midX} ${midY} ${last.x} ${last.y}`;
  };

  const topPath = buildPath(topGates, 'down');
  const bottomPath = buildPath(bottomGates, 'up');

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {topPath && (
        <path
          d={topPath}
          fill="none"
          stroke={isNight ? '#2a4a5a' : '#2a5a6a'}
          strokeWidth="1.5"
          opacity="0.6"
        />
      )}
      {topPath && (
        <path
          d={topPath}
          fill={isNight ? '#1a3040' : '#f5e8c8'}
          stroke="none"
          opacity="0.3"
          strokeWidth="0"
          transform="translate(0, -3)"
        />
      )}
      {bottomPath && (
        <path
          d={bottomPath}
          fill="none"
          stroke={isNight ? '#2a4a5a' : '#2a5a6a'}
          strokeWidth="1.5"
          opacity="0.6"
        />
      )}
      {bottomPath && (
        <path
          d={bottomPath}
          fill={isNight ? '#1a3040' : '#f5e8c8'}
          stroke="none"
          opacity="0.3"
          strokeWidth="0"
          transform="translate(0, 3)"
        />
      )}
    </svg>
  );
}

// --- Tarmac Layout ---
function TarmacLayout({ isNight, gates, capacity }: { isNight: boolean; gates: Gate[]; capacity: number }) {
  const bgColor = isNight ? '#1a2540' : '#5b9bd5';
  const tarmacColor = isNight ? '#2a3a4a' : '#6b8090';
  const runwayColor = isNight ? '#1a2a35' : '#5a7080';
  const gateBadgeColor = isNight ? '#1a3a4a' : '#2a5a6a';
  const markingOpacity = isNight ? 0.4 : 0.7;
  const lightOpacity = isNight ? 0.9 : 0.4;

  const topGates = gates.filter(g => g.y < 50);
  const bottomGates = gates.filter(g => g.y >= 50);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bgColor }}>
      {/* Tarmac surface */}
      <div
        className="absolute"
        style={{
          left: '3%', right: '3%', top: '5%', bottom: '5%',
          background: tarmacColor,
          borderRadius: '12px',
        }}
      />

      {/* Terminal building SVG curves */}
      <TerminalBuildings gates={gates} capacity={capacity} isNight={isNight} />

      {/* Gate badges - top arc */}
      {topGates.map(gate => (
        <div
          key={`gate-top-${gate.id}`}
          className="absolute flex flex-col items-center"
          style={{ left: `${gate.x}%`, top: `${gate.y - 5}%`, transform: 'translateX(-50%)' }}
        >
          <div
            className="rounded-sm text-[8px] font-bold text-white px-1.5 py-0.5 tracking-wider"
            style={{ background: gateBadgeColor }}
          >
            G{gate.id}
          </div>
          <div className="w-[1.5px] h-2 mt-0.5" style={{ background: '#ffffff', opacity: markingOpacity * 0.6 }} />
        </div>
      ))}

      {/* Gate badges - bottom arc */}
      {bottomGates.map(gate => (
        <div
          key={`gate-bot-${gate.id}`}
          className="absolute flex flex-col items-center"
          style={{ left: `${gate.x}%`, top: `${gate.y + 3}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-[1.5px] h-2 mb-0.5" style={{ background: '#ffffff', opacity: markingOpacity * 0.6 }} />
          <div
            className="rounded-sm text-[8px] font-bold text-white px-1.5 py-0.5 tracking-wider"
            style={{ background: gateBadgeColor }}
          >
            G{gate.id}
          </div>
        </div>
      ))}

      {/* Taxiway lines */}
      <div
        className="absolute left-[5%] right-[5%] h-[1px]"
        style={{ top: '35%', background: '#ffffff', opacity: markingOpacity * 0.3 }}
      />
      <div
        className="absolute left-[5%] right-[5%] h-[1px]"
        style={{ top: '62%', background: '#ffffff', opacity: markingOpacity * 0.3 }}
      />

      {/* Runway */}
      <div
        className="absolute left-[5%] right-[5%]"
        style={{ top: '43%', height: '14%', background: runwayColor, borderRadius: '4px' }}
      >
        {/* Center dashes */}
        <div className="absolute top-1/2 left-[3%] right-[3%] flex items-center justify-between -translate-y-1/2">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="h-[2px] flex-1 mx-1"
              style={{ background: '#ffffff', opacity: markingOpacity }}
            />
          ))}
        </div>
        {/* Threshold markings left */}
        <div className="absolute left-[3%] top-[20%] bottom-[20%] flex flex-col justify-between">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-4 h-[2px]" style={{ background: '#ffffff', opacity: markingOpacity * 0.7 }} />
          ))}
        </div>
        {/* Threshold markings right */}
        <div className="absolute right-[3%] top-[20%] bottom-[20%] flex flex-col justify-between">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-4 h-[2px]" style={{ background: '#ffffff', opacity: markingOpacity * 0.7 }} />
          ))}
        </div>
        {/* Runway edge lights top */}
        <div className="absolute left-[2%] right-[2%] top-0 flex justify-between">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`lt-${i}`} className="w-2 h-2 rounded-full" style={{ background: '#e8c040', opacity: lightOpacity }} />
          ))}
        </div>
        {/* Runway edge lights bottom */}
        <div className="absolute left-[2%] right-[2%] bottom-0 flex justify-between">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`lb-${i}`} className="w-2 h-2 rounded-full" style={{ background: '#e8c040', opacity: lightOpacity }} />
          ))}
        </div>
      </div>

      {/* Wind sock */}
      <div className="absolute right-[6%] top-[7%] flex items-center gap-1">
        <div className="w-[2px] h-5 bg-white opacity-40" />
        <div className="w-3 h-2 opacity-50" style={{ background: '#e87060', clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }} />
      </div>
    </div>
  );
}

// --- Arrivals Board ---
function ArrivalsBoard({
  planes,
  readIds,
  isNight,
  onPlaneClick,
}: {
  planes: PaperPlane[];
  readIds: Set<string>;
  isNight: boolean;
  onPlaneClick: (plane: PaperPlane) => void;
}) {
  const boardBg = isNight ? '#0f1a2a' : '#ffffff';
  const headerBg = isNight ? '#1a2540' : '#2a5a6a';
  const rowEven = isNight ? '#141e30' : '#f8fafb';
  const rowOdd = isNight ? '#0f1a2a' : '#ffffff';
  const borderColor = isNight ? '#1e2e40' : '#e8edf2';
  const textColor = isNight ? '#c0d0e0' : '#2a3a4a';
  const mutedColor = isNight ? '#607080' : '#8090a0';

  const sorted = [...planes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: boardBg }}>
      {/* Board header */}
      <div
        className="flex items-center gap-2 px-4 py-3 shrink-0"
        style={{ background: headerBg }}
      >
        <ArrivalIcon />
        <span className="text-white text-sm font-semibold tracking-wide">Arrivals</span>
        <span className="text-white/50 text-xs ml-auto">{planes.length} total</span>
      </div>

      {/* Column headers */}
      <div
        className="grid grid-cols-[60px_1fr_56px_40px] px-4 py-2 text-[10px] font-bold tracking-wider uppercase shrink-0"
        style={{ color: mutedColor, borderBottom: `1px solid ${borderColor}` }}
      >
        <span>Flight</span>
        <span>From</span>
        <span>Time</span>
        <span>Status</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence initial={false}>
          {sorted.map((plane, idx) => {
            const isRead = readIds.has(plane.id);
            return (
              <motion.div
                key={plane.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-[60px_1fr_56px_40px] px-4 py-2.5 items-center cursor-pointer hover:bg-black/5 transition-colors"
                style={{
                  background: idx % 2 === 0 ? rowEven : rowOdd,
                  borderBottom: `1px solid ${borderColor}`,
                }}
                onClick={() => onPlaneClick(plane)}
              >
                {/* Flight ID */}
                <span
                  className="text-[11px] font-mono font-bold tracking-wider"
                  style={{ color: isRead ? mutedColor : textColor }}
                >
                  {plane.id.slice(-4).toUpperCase()}
                </span>

                {/* Sender */}
                <span
                  className="text-[11px] truncate pr-2"
                  style={{ color: isRead ? mutedColor : textColor }}
                >
                  {plane.senderName || 'Anonymous'}
                </span>

                {/* Time */}
                <span className="text-[10px] font-mono" style={{ color: mutedColor }}>
                  {new Date(plane.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                {/* Status dot */}
                <div className="flex justify-center">
                  {isRead ? (
                    <span className="text-[9px]" style={{ color: mutedColor }}>Read</span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#e87060' }} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {planes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 opacity-40">
            <ArrivalIcon />
            <p className="text-xs mt-2" style={{ color: mutedColor }}>No arrivals yet</p>
          </div>
        )}
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative w-full max-w-md rounded-2xl shadow-2xl p-6"
        style={{ background: 'rgba(255,255,255,0.97)', color: '#1a2a3a' }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 opacity-40 hover:opacity-100 transition-opacity"
        >
          <CloseIcon />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold tracking-wider font-mono" style={{ color: '#2a5a6a' }}>
            FLIGHT {plane.id.slice(-6).toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs opacity-60">
            {plane.senderName || 'Anonymous Passenger'}
          </span>
          <span className="text-xs opacity-40">
            {new Date(plane.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="rounded-xl p-4 mb-5" style={{ background: '#f5f3ef' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#1a2a3a' }}>
            {plane.content}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={plane.isBroadcasted ? onUnbroadcast : onBroadcast}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: plane.isBroadcasted ? '#e87060' : 'transparent',
              color: plane.isBroadcasted ? '#fff' : '#e87060',
              border: '1.5px solid #e87060',
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

// --- Capacity Selector ---
function CapacitySelector({
  capacity,
  onChange,
  isNight,
}: {
  capacity: number;
  onChange: (val: number) => void;
  isNight: boolean;
}) {
  const trackBg = isNight ? '#1a2540' : '#2a5a6a';
  const textColor = isNight ? '#a0b8d0' : '#ffffff';

  return (
    <div
      className="flex items-center gap-4 px-4 py-2"
      style={{ background: isNight ? 'rgba(15,26,42,0.9)' : 'rgba(42,90,106,0.85)', backdropFilter: 'blur(4px)' }}
    >
      <span className="text-[11px] font-semibold tracking-wide" style={{ color: textColor }}>
        Terminal Capacity
      </span>
      <input
        type="range"
        min={5}
        max={50}
        step={5}
        value={capacity}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #e8c040 0%, #e8c040 ${((capacity - 5) / 45) * 100}%, ${trackBg} ${((capacity - 5) / 45) * 100}%, ${trackBg} 100%)`,
          accentColor: '#e8c040',
        }}
      />
      <span className="text-[11px] font-mono font-bold min-w-[60px] text-right" style={{ color: textColor }}>
        {capacity} gates
      </span>
    </div>
  );
}

// --- Main Page Component ---
export default function AdminRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  const { userId } = useUserStore();
  const { theme } = useTheme();
  const isNight = theme === 'night';

  const [capacity, setCapacity] = useState(20);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [gateAssignments, setGateAssignments] = useState<Map<string, number>>(new Map());
  const [selectedPlane, setSelectedPlane] = useState<PaperPlane | null>(null);
  const [landingPlanes, setLandingPlanes] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const prevPlaneIdsRef = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef(true);

  const gates = generateGates(capacity);

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

  const assignGate = useCallback((planeId: string, currentAssignments: Map<string, number>, currentGates: Gate[]): number => {
    const occupiedGates = new Set(currentAssignments.values());
    for (const gate of currentGates) {
      if (!occupiedGates.has(gate.id)) {
        return gate.id;
      }
    }
    return (currentAssignments.size % currentGates.length) + 1;
  }, []);

  useEffect(() => {
    if (!planesQuery.data) return;

    const currentIds = new Set(planesQuery.data.map((p) => p.id));

    if (initialLoadRef.current) {
      const assignments = new Map<string, number>();
      planesQuery.data.forEach((plane) => {
        const gateId = assignGate(plane.id, assignments, gates);
        assignments.set(plane.id, gateId);
      });
      setGateAssignments(assignments);
      prevPlaneIdsRef.current = currentIds;
      initialLoadRef.current = false;
      return;
    }

    const newIds: string[] = [];
    currentIds.forEach((id) => {
      if (!prevPlaneIdsRef.current.has(id)) {
        newIds.push(id);
      }
    });

    const removedIds: string[] = [];
    prevPlaneIdsRef.current.forEach((id) => {
      if (!currentIds.has(id)) {
        removedIds.push(id);
      }
    });

    if (newIds.length > 0 || removedIds.length > 0) {
      setGateAssignments((prev) => {
        const next = new Map(prev);
        removedIds.forEach((id) => next.delete(id));
        newIds.forEach((id) => {
          const gateId = assignGate(id, next, gates);
          next.set(id, gateId);
        });
        return next;
      });

      if (newIds.length > 0) {
        setLandingPlanes((prev) => {
          const next = new Set(prev);
          newIds.forEach((id) => next.add(id));
          return next;
        });
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
  }, [planesQuery.data, assignGate, gates]);

  // Reassign gates when capacity changes
  useEffect(() => {
    if (!planesQuery.data || initialLoadRef.current) return;
    const assignments = new Map<string, number>();
    planesQuery.data.forEach((plane) => {
      const gateId = assignGate(plane.id, assignments, gates);
      assignments.set(plane.id, gateId);
    });
    setGateAssignments(assignments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capacity]);

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
    <div className="h-screen w-screen relative overflow-hidden select-none flex flex-col">
      {/* Header Bar */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0 z-20"
        style={{ background: 'rgba(26,42,58,0.92)', backdropFilter: 'blur(8px)' }}
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

        <div className="flex items-center gap-1.5 text-white/60 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>{planes.length} flights</span>
        </div>

        <div className="ml-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Capacity Selector */}
      <CapacitySelector capacity={capacity} onChange={setCapacity} isNight={isNight} />

      {/* Main Content: Two panels */}
      <div className="flex flex-1 min-h-0">
        {/* LEFT: Airport Tarmac View (60%) */}
        <div className="relative w-[60%] h-full overflow-hidden">
          <TarmacLayout isNight={isNight} gates={gates} capacity={capacity} />

          {/* Planes on the tarmac */}
          <div className="absolute inset-0 z-10">
            <AnimatePresence>
              {planes.map((plane) => {
                const gateId = gateAssignments.get(plane.id);
                if (!gateId) return null;
                const gate = gates.find((g) => g.id === gateId);
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
                    {!isRead && (
                      <motion.div
                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                        style={{ background: '#e87060' }}
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                    <PlaneTopDown isRead={isRead} size={44} />
                    <div
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] font-mono font-bold tracking-wider whitespace-nowrap"
                      style={{ color: isRead ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)' }}
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
        </div>

        {/* RIGHT: Arrivals Board (40%) */}
        <div className="w-[40%] h-full border-l" style={{ borderColor: isNight ? '#1e2e40' : '#d0dae0' }}>
          <ArrivalsBoard
            planes={planes}
            readIds={readIds}
            isNight={isNight}
            onPlaneClick={handlePlaneClick}
          />
        </div>
      </div>

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
