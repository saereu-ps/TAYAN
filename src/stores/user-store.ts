'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  sessionId: string | null;
  setUser: (id: string, name: string, email?: string) => void;
  setSession: (sessionId: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      userName: null,
      userEmail: null,
      sessionId: null,
      setUser: (id, name, email) => set({ userId: id, userName: name, userEmail: email ?? null }),
      setSession: (sessionId) => set({ sessionId }),
      logout: () => set({ userId: null, userName: null, userEmail: null, sessionId: null }),
    }),
    { name: 'paper-plane-user' },
  ),
);
