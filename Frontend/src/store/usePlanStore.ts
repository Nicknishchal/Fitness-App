import { create } from 'zustand';
import type { WorkoutPlan, Exercise, Day } from '../types';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

interface PlanState {
  plans: WorkoutPlan[];
  currentPlan: WorkoutPlan | null;
  templates: WorkoutPlan[];
  isLoading: boolean;
  fetchPlans: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  fetchPlanById: (id: string) => Promise<void>;
  createPlan: (plan: Partial<WorkoutPlan>) => Promise<void>;
  updatePlan: (id: string, plan: Partial<WorkoutPlan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  duplicatePlan: (id: string) => Promise<void>;
  addDay: (planId: string, day: Partial<Day>) => Promise<void>;
  updateDay: (planId: string, dayId: string, day: Partial<Day>) => Promise<void>;
  deleteDay: (planId: string, dayId: string) => Promise<void>;
  addExercise: (planId: string, dayId: string, exercise: Partial<Exercise>) => Promise<void>;
  updateExercise: (planId: string, dayId: string, exerciseId: string, exercise: Partial<Exercise>) => Promise<void>;
  deleteExercise: (planId: string, dayId: string, exerciseId: string) => Promise<void>;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plans: [],
  currentPlan: null,
  templates: [],
  isLoading: false,

  fetchPlans: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/plans');
      set({ plans: response.data, isLoading: false });
    } catch {
      toast.error('Failed to fetch plans');
      set({ isLoading: false });
    }
  },

  fetchTemplates: async () => {
    try {
      const response = await axiosInstance.get('/plans/templates');
      set({ templates: response.data });
    } catch {
      toast.error('Failed to fetch templates');
    }
  },

  fetchPlanById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/plans/${id}`);
      set({ currentPlan: response.data, isLoading: false });
    } catch {
      toast.error('Failed to fetch plan details');
      set({ isLoading: false });
    }
  },

  createPlan: async (planData) => {
    try {
      const response = await axiosInstance.post('/plans', planData);
      set((state) => ({ plans: [response.data, ...state.plans] }));
      toast.success('Plan created successfully');
    } catch {
      toast.error('Failed to create plan');
    }
  },

  updatePlan: async (id, planData) => {
    try {
      const response = await axiosInstance.put(`/plans/${id}`, planData);
      set((state) => ({
        plans: state.plans.map((p) => (p.id === id ? response.data : p)),
        currentPlan: state.currentPlan?.id === id ? response.data : state.currentPlan,
      }));
      toast.success('Plan updated');
    } catch {
      toast.error('Failed to update plan');
    }
  },

  deletePlan: async (id) => {
    try {
      await axiosInstance.delete(`/plans/${id}`);
      set((state) => ({
        plans: state.plans.filter((p) => p.id !== id),
        currentPlan: state.currentPlan?.id === id ? null : state.currentPlan,
      }));
      toast.success('Plan deleted');
    } catch {
      toast.error('Failed to delete plan');
    }
  },

  duplicatePlan: async (id) => {
    try {
      await axiosInstance.post(`/plans/${id}/duplicate`);
      await get().fetchPlans();
      toast.success('Plan duplicated');
    } catch {
      toast.error('Failed to duplicate plan');
    }
  },



  addDay: async (planId, dayData) => {
    try {
      const response = await axiosInstance.post(`/plans/${planId}/days`, dayData);
      const updatedPlan = { ...get().currentPlan!, days: [...get().currentPlan!.days, response.data] };
      set({ currentPlan: updatedPlan });
      toast.success('Day added');
    } catch {
      toast.error('Failed to add day');
    }
  },

  updateDay: async (planId, dayId, dayData) => {
    try {
      const response = await axiosInstance.put(`/plans/${planId}/days/${dayId}`, dayData);
      const updatedPlan = {
        ...get().currentPlan!,
        days: get().currentPlan!.days.map((d) => (d.id === dayId ? response.data : d)),
      };
      set({ currentPlan: updatedPlan });
      toast.success('Day updated');
    } catch {
      toast.error('Failed to update day');
    }
  },

  deleteDay: async (planId, dayId) => {
    try {
      await axiosInstance.delete(`/plans/${planId}/days/${dayId}`);
      const updatedPlan = {
        ...get().currentPlan!,
        days: get().currentPlan!.days.filter((d) => d.id !== dayId),
      };
      set({ currentPlan: updatedPlan });
      toast.success('Day deleted');
    } catch {
      toast.error('Failed to delete day');
    }
  },

  addExercise: async (planId, dayId, exerciseData) => {
    try {
      const response = await axiosInstance.post(`/plans/${planId}/days/${dayId}/exercises`, exerciseData);
      const updatedPlan = {
        ...get().currentPlan!,
        days: get().currentPlan!.days.map((d) =>
          d.id === dayId ? { ...d, exercises: [...d.exercises, response.data] } : d
        ),
      };
      set({ currentPlan: updatedPlan });
      toast.success('Exercise added');
    } catch {
      toast.error('Failed to add exercise');
    }
  },

  updateExercise: async (planId, dayId, exerciseId, exerciseData) => {
    try {
      const response = await axiosInstance.put(`/plans/${planId}/days/${dayId}/exercises/${exerciseId}`, exerciseData);
      const updatedPlan = {
        ...get().currentPlan!,
        days: get().currentPlan!.days.map((d) =>
          d.id === dayId
            ? {
              ...d,
              exercises: d.exercises.map((e) => (e.id === exerciseId ? response.data : e)),
            }
            : d
        ),
      };
      set({ currentPlan: updatedPlan });
      toast.success('Exercise updated');
    } catch {
      toast.error('Failed to update exercise');
    }
  },

  deleteExercise: async (planId, dayId, exerciseId) => {
    try {
      await axiosInstance.delete(`/plans/${planId}/days/${dayId}/exercises/${exerciseId}`);
      const updatedPlan = {
        ...get().currentPlan!,
        days: get().currentPlan!.days.map((d) =>
          d.id === dayId
            ? {
              ...d,
              exercises: d.exercises.filter((e) => e.id !== exerciseId),
            }
            : d
        ),
      };
      set({ currentPlan: updatedPlan });
      toast.success('Exercise deleted');
    } catch {
      toast.error('Failed to delete exercise');
    }
  },
}));
