import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createClient } from '@/lib/supabase/client';
import { setCredentials, logout, setLoading, setError } from '@/store/slices/authSlice';
import { RootState } from '@/store/types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      dispatch(setLoading(true));
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        dispatch(setCredentials({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.full_name || session.user.user_metadata.name || session.user.email!,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at,
            avatar_url: session.user.user_metadata.avatar_url,
            picture: session.user.user_metadata.picture,
          },
          token: session.access_token,
        }));
      }
      dispatch(setLoading(false));
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          dispatch(setCredentials({
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata.full_name || session.user.user_metadata.name || session.user.email!,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at || session.user.created_at,
              avatar_url: session.user.user_metadata.avatar_url,
              picture: session.user.user_metadata.picture,
            },
            token: session.access_token,
          }));
        } else if (event === 'SIGNED_OUT') {
          dispatch(logout());
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [dispatch, supabase]);

  const signInWithGoogle = async () => {
    const getRedirectUrl = () => {
      if (typeof window !== 'undefined') {
        return `${window.location.origin}/auth/callback`;
      }
      return process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
        : 'http://localhost:3000/auth/callback';
    };
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl(),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    return { error };
  };

  const signInWithFacebook = async () => {
    const getRedirectUrl = () => {
      if (typeof window !== 'undefined') {
        return `${window.location.origin}/auth/callback`;
      }
      return process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
        : 'http://localhost:3000/auth/callback';
    };
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: getRedirectUrl(),
        scopes: 'email',
      },
    });
    return { error };
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const getRedirectUrl = () => {
      if (typeof window !== 'undefined') {
        return `${window.location.origin}/auth/callback?type=signup`;
      }
      return process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?type=signup`
        : 'http://localhost:3000/auth/callback?type=signup';
    };
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    ...auth,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUp,
    signOut,
  };
};