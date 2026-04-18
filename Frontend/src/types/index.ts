export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  sets: number;
  reps?: string; // e.g. "10-12" or "To failure"
  duration?: number; // in seconds
  rest_time?: number; // in seconds
  youtube_link?: string;
  image_url?: string;
  order: number;
}

export interface Day {
  id: string;
  name: string;
  order: number;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  days_count: number;
  days: Day[];
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSession {
  id: string;
  plan_id: string;
  start_time: string;
  end_time?: string;
  completed_exercises: string[]; // exercise ids
  is_completed: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Stats {
  total_workouts: number;
  streak: number;
  completion_rate: number;
  last_7_days: number[];
}

export interface Progress {
  id: string;
  plan_id: string;
  day_id: string;
  exercise_id: string;
  completed: boolean;
  time_taken: number;
  completed_at: string;
}
