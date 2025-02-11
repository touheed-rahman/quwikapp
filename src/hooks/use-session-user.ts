
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useSessionUser(conversationId: string | undefined) {
  const navigate = useNavigate();
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error fetching session:', sessionError);
          await supabase.auth.signOut(); // Clear any invalid session data
          navigate('/profile');
          return;
        }

        if (!session) {
          if (conversationId) {
            localStorage.setItem('intended_conversation', conversationId);
          }
          navigate('/profile');
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('Error fetching user:', userError);
          await supabase.auth.signOut(); // Clear any invalid session data
          navigate('/profile');
          return;
        }

        setSessionUser(user);
      } catch (error) {
        console.error('Session initialization error:', error);
        await supabase.auth.signOut(); // Clear any invalid session data
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT' || !session) {
          setSessionUser(null);
          navigate('/profile');
          return;
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSessionUser(session.user);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, conversationId]);

  return { sessionUser, loading };
}
