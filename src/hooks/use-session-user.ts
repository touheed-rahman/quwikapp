
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export function useSessionUser(conversationId: string | undefined) {
  const navigate = useNavigate();
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error fetching session:', sessionError);
          // Clear any invalid session data but don't redirect yet
          await supabase.auth.signOut();
          setSessionUser(null);
          setLoading(false);
          return;
        }

        if (!session) {
          if (conversationId) {
            localStorage.setItem('intended_conversation', conversationId);
          }
          setSessionUser(null);
          setLoading(false);
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('Error fetching user:', userError);
          // Clear any invalid session data
          await supabase.auth.signOut();
          setSessionUser(null);
          setLoading(false);
          return;
        }

        setSessionUser(user);
        setLoading(false);
      } catch (error) {
        console.error('Session initialization error:', error);
        // Clear any invalid session data
        await supabase.auth.signOut();
        setSessionUser(null);
        setLoading(false);
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT' || !session) {
          setSessionUser(null);
          return;
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSessionUser(session.user);
          
          // Show success toast on successful login
          if (event === 'SIGNED_IN') {
            toast({
              title: "Successfully signed in",
              description: "Welcome to Quwik!"
            });
          }
          
          // Check if there's an intended conversation to redirect to
          const intendedConversation = localStorage.getItem('intended_conversation');
          if (intendedConversation) {
            localStorage.removeItem('intended_conversation');
            navigate(`/chat/${intendedConversation}`);
          } else {
            // Only redirect to home if we're on the profile page
            if (window.location.pathname === '/profile') {
              navigate('/');
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, conversationId]);

  // Use the useEffect hook to handle redirects based on session state
  useEffect(() => {
    if (!loading && !sessionUser && window.location.pathname !== '/profile') {
      navigate('/profile');
    }
  }, [sessionUser, loading, navigate]);

  return { sessionUser, loading };
}
