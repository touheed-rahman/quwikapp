
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export function useSessionUser(conversationId: string | undefined) {
  const navigate = useNavigate();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
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

        setSessionUser(session.user);
      } catch (error) {
        console.error('Session initialization error:', error);
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setSessionUser(null);
          navigate('/profile');
          return;
        }
        
        setSessionUser(session.user);
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, conversationId]);

  return { sessionUser, loading };
}
