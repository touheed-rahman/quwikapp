
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export function useSessionUser(conversationId: string | undefined) {
  const navigate = useNavigate();
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (conversationId) {
          localStorage.setItem('intended_conversation', conversationId);
        }
        navigate('/profile');
        return;
      }
      setSessionUser(session.user);
    };
    getSession();
  }, [navigate, conversationId]);

  return sessionUser;
}
