'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userId: string | null;
  userName: string | null;
  sessionId: string | null;
  setUser: (id: string, name: string) => void;
  setSession: (sessionId: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      userName: null,
      sessionId: null,
      setUser: (id, name) => set({ userId: id, userName: name }),
      setSession: (sessionId) => set({ sessionId }),
      logout: () => set({ userId: null, userName: null, sessionId: null }),
    }),
    { name: 'paper-plane-user' },
  ),
);
