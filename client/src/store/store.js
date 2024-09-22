import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  auth: {
    userName: '',
    active: false,
  },
  setUsername: (name) => set((state) => ({ auth: { ...state.auth, userName: name } }))
}));