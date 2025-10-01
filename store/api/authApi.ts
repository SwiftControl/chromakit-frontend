import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createClient } from '@/lib/supabase/client';
import type { RootState } from '../index';
import {
  User,
  ProfileUpdateRequest,
} from '@/lib/types/auth.types';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  prepareHeaders: async (headers) => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }

    if (!headers.get('content-type')) {
      headers.set('content-type', 'application/json');
    }
    
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Validate JWT token with the backend
    validateToken: builder.query<{ user_id: string; email: string }, void>({
      query: () => '/auth/validate',
      providesTags: ['User'],
    }),

    // Get current user profile  
    getCurrentUser: builder.query<{ id: string; email: string; name: string; created_at: string }, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Update user profile
    updateProfile: builder.mutation<{ id: string; email: string; name: string }, { name: string }>({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useValidateTokenQuery,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} = authApi;