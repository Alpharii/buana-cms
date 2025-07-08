import { create } from 'zustand'
import apiClient from '../lib/apiClient'

interface AuthState {
  user: null | { id: string; email: string; name?: string }
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })

    try {
      const res = await apiClient.post('/auth/login', { email, password })
      const { token, user } = res.data

      localStorage.setItem('token', token)
      set({ token, user, isAuthenticated: true, isLoading: false })
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login gagal'
      set({ error: message, isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null, isAuthenticated: false })
  },
}))