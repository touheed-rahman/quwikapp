
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ChatFilters } from "./ChatFilters";
import { ChatHeader } from "./ChatHeader";
import { ConversationItem } from "./ConversationItem";
import type { ChatWindowProps, Conversation } from "./types";

const ChatWindow = ({ isOpen, onClose, initialSeller }: ChatWindowProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionUser(session?.user);
    };
    getSession();
  }, []);

  useEffect(() => {
    if (!sessionUser) return;

    const fetchConversations = async () => {
      let query = supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(title, price),
          seller:profiles!conversations_seller_id_fkey(full_name, avatar_url),
          notifications!inner (unread_count)
        `)
        .or(`buyer_id.eq.${sessionUser.id},seller_id.eq.${sessionUser.id}`);

      // Apply tab filters
      if (activeTab === 'buying') {
        query = query.eq('buyer_id', sessionUser.id);
      } else if (activeTab === 'selling') {
        query = query.eq('seller_id', sessionUser.id);
      }

      // Apply additional filters
      if (activeFilter === 'unread') {
        query = query.gt('notifications.unread_count', 0);
      } else if (activeFilter === 'meeting') {
        query = query.ilike('last_message', '%meeting%');
      } else if (activeFilter === 'important') {
        query = query.eq('notifications.unread_count', 0);
      }

      query = query.order('last_message_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching conversations",
          description: error.message
        });
        return;
      }

      setConversations(data || []);
    };

    fetchConversations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `buyer_id=eq.${sessionUser.id}`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionUser, toast, activeFilter, activeTab]);

  const handleAvatarClick = async (conversationId: string) => {
    onClose();
    navigate(`/chat/${conversationId}`);
  };

  if (!isOpen) return null;

  if (!sessionUser) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg">
          <div className="flex flex-col items-center justify-center h-full p-4">
            <p className="text-lg mb-4">Please sign in to use chat</p>
            <Button onClick={() => navigate('/profile')}>Sign In</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg animate-in slide-in-from-right">
        <div className="flex flex-col h-full">
          <ChatHeader onClose={onClose} />
          <ChatFilters 
            activeFilter={activeFilter} 
            setActiveFilter={setActiveFilter}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                userId={sessionUser.id}
                onClick={handleAvatarClick}
                unreadCount={conversation.notifications?.[0]?.unread_count || 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
