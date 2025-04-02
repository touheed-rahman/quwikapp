
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export const useSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user is a service provider
          setTimeout(async () => {
            try {
              const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (data) {
                // Check if data has a role property
                if (data.role) {
                  setUserRole(data.role);
                } else if (data.user_type) {
                  // Fallback to user_type if role doesn't exist
                  setUserRole(data.user_type);
                }
              }
            } catch (err) {
              console.error("Error fetching user profile:", err);
            }
          }, 0);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user is a service provider
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              // Check if data has a role property
              if (data.role) {
                setUserRole(data.role);
              } else if (data.user_type) {
                // Fallback to user_type if role doesn't exist
                setUserRole(data.user_type);
              }
            }
          })
          .catch(err => console.error("Error fetching user profile:", err));
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return { success: false, error };
    }
  };

  const isServiceProvider = () => {
    return userRole === 'service_provider' || userRole === 'service_admin';
  };

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!session?.user,
    isServiceProvider,
    userRole
  };
};
