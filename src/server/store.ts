// In-memory store — replaces PostgreSQL + Redis
// Uses globalThis to persist across Vercel serverless function invocations
// within the same warm instance. Resets on cold start.

export interface User {
  id: string;
  name: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  code: string;
  status: 'active' | 'paused' | 'closed';
  identityMode: 'anonymous' | 'identified';
  ownerId: string;
  participantCount: number;
  createdAt: string;
}

export interface PaperPlane {
  id: string;
  roomId: string;
  content: string;
  senderName?: string;
  senderSessionId: string;
  status: 'active' | 'removed';
  isBroadcasted: boolean;
  isPinned: boolean;
  broadcastedAt?: string;
  createdAt: string;
}

// Use globalThis for persistence across serverless invocations
const g = globalThis as any;
if (!g.__paperPlaneStore) {
  g.__paperPlaneStore = {
    users: new Map<string, User>(),
    rooms: new Map<string, Room>(),
    planes: new Map<string, PaperPlane>(),
    roomCodeIndex: new Map<string, string>(),
    counter: 0,
  };
}

export const users: Map<string, User> = g.__paperPlaneStore.users;
export const rooms: Map<string, Room> = g.__paperPlaneStore.rooms;
export const planes: Map<string, PaperPlane> = g.__paperPlaneStore.planes;
export const roomCodeIndex: Map<string, string> = g.__paperPlaneStore.roomCodeIndex;

// --- Rate Limiter ---
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count++;
  return true;
}

// --- Helpers ---
export function genId(): string {
  g.__paperPlaneStore.counter++;
  return `${Date.now().toString(36)}-${g.__paperPlaneStore.counter.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function genRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
