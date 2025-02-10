
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
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
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(title, price),
          seller:profiles!conversations_seller_id_fkey(full_name, avatar_url)
        `)
        .or(`buyer_id.eq.${sessionUser.id},seller_id.eq.${sessionUser.id}`)
        .order('last_message_at', { ascending: false });

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

    // Subscribe to real-time updates for conversations
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
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setConversations(prev => 
              prev.map(conv => 
                conv.id === payload.new.id 
                  ? { ...conv, ...payload.new }
                  : conv
              )
            );
          } else if (payload.eventType === 'INSERT') {
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionUser, toast]);

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
          <ChatFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          
          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                userId={sessionUser.id}
                onClick={handleAvatarClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
