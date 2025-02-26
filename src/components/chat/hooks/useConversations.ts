
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Conversation, ChatFilter } from "../types/chat-window";

export const useConversations = (isOpen: boolean, filter: ChatFilter) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      let query = supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(id, title, price),
          seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url),
          buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url)
        `)
        .eq('deleted', false)
        .order('last_message_at', { ascending: false });

      if (filter === 'buying') {
        query = query.eq('buyer_id', user.id);
      } else if (filter === 'selling') {
        query = query.eq('seller_id', user.id);
      } else {
        query = query.or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load conversations"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (isOpen && session) {
        fetchConversations();
      }
    };
    checkAuth();
  }, [isOpen, filter]);

  return { conversations, setConversations, isLoading, isAuthenticated };
};
