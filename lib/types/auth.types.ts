// Authentication types for Supabase-based auth
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  picture?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Profile update request
export interface ProfileUpdateRequest {
  name: string;
}