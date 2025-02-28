
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatDetailHeader from "@/components/chat/ChatDetailHeader";
import { MessageList } from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/use-chat";
import { supabase } from "@/integrations/supabase/client";

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    messages,
    isLoading,
    sessionUser,
    conversationDetails,
    newMessage,
    setNewMessage,
    handleSend,
    chatDisabled,
    disabledReason
  } = useChat(id);

  // Check if conversation still exists or has been deleted
  useEffect(() => {
    if (!id || !sessionUser) return;
    
    const checkConversation = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('deleted')
        .eq('id', id)
        .maybeSingle();
        
      if (error || !data || data.deleted) {
        navigate('/');
      }
    };
    
    checkConversation();
    
    // Listen for changes to conversation
    const channel = supabase
      .channel(`conversation-status-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${id}`
        },
        (payload) => {
          if (payload.new && (payload.new as any).deleted) {
            navigate('/');
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, sessionUser, navigate]);

  const handleBack = () => {
    navigate('/chat');
  };

  if (!sessionUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <p className="text-lg mb-4">Please sign in to view this chat</p>
        <Button onClick={() => navigate('/profile')}>Sign In</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <ChatDetailHeader 
        conversationDetails={conversationDetails} 
        onBack={handleBack}
      />
      <MessageList messages={messages} sessionUserId={sessionUser.id} />
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSend={handleSend}
        disabled={chatDisabled}
        disabledReason={disabledReason}
      />
    </div>
  );
};

export default ChatDetail;
