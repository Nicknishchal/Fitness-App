import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import type { Progress } from '../types';

interface ProgressState {
  streak: number;
  history: Progress[];
  isLoading: boolean;
  fetchStreak: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  trackProgress: (data: Partial<Progress>) => Promise<void>;
}


export const useProgressStore = create<ProgressState>((set) => ({
  streak: 0,
  history: [],
  isLoading: false,

  fetchStreak: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/progress/streak');
      set({ streak: response.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchHistory: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/progress/history');
      set({ history: response.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  trackProgress: async (data: Partial<Progress>) => {
    try {
      await axiosInstance.post('/progress/', data);
    } catch {
      console.error('Failed to track progress');
    }
  },
}));


