import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userId: null,
      role: null,
      authType: null, // 'user' | 'agent'
      user: null,

      login: (authResponse, authType = 'user') => set({
        token: authResponse.accessToken,
        userId: authResponse.userId,
        role: authResponse.role,
        authType,
      }),

      setUser: (user) => set({ user }),

      logout: () => set({
        token: null, userId: null, role: null, authType: null, user: null,
      }),
    }),
    { name: 'nextstay-auth' }
  )
)
