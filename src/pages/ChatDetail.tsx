import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatDetailHeader from "@/components/chat/ChatDetailHeader";
import { MessageList } from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/use-chat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useOnlineUsers } from "@/hooks/use-online-users";
import QuickMessageSuggestions from "@/components/chat/QuickMessageSuggestions";
import ChatTipBox from "@/components/chat/ChatTipBox";

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { onlineUsers } = useOnlineUsers();
  
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

  // Check if conversation exists or has been deleted
  useEffect(() => {
    if (!id || !sessionUser) return;
    
    const checkConversation = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('deleted')
        .eq('id', id)
        .maybeSingle();
        
      if (error) {
        console.error("Error checking conversation:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not verify conversation status."
        });
        navigate('/');
        return;
      }
      
      if (!data || data.deleted) {
        toast({
          title: "Conversation not available",
          description: "This conversation has been deleted or doesn't exist."
        });
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
            toast({
              title: "Conversation deleted",
              description: "This conversation has been deleted."
            });
            navigate('/');
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, sessionUser, navigate, toast]);

  const handleBack = () => {
    navigate('/chat');
  };

  const handleQuickMessage = (message: string) => {
    setNewMessage(message);
    // Optional: automatically send the message
    // setTimeout(() => handleSend(), 100);
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

  // Determine if the other user is online
  const otherUserId = conversationDetails 
    ? (sessionUser.id === conversationDetails.buyer_id 
      ? conversationDetails.seller_id 
      : conversationDetails.buyer_id)
    : null;
  
  const isOtherUserOnline = otherUserId ? onlineUsers.has(otherUserId) : false;
  const isBuyer = conversationDetails && sessionUser.id === conversationDetails.buyer_id;
  const isEmptyChat = messages.length === 0;

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <ChatDetailHeader 
        conversationDetails={conversationDetails} 
        onBack={handleBack}
        isOnline={isOtherUserOnline}
      />
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} sessionUserId={sessionUser.id} />
        
        {/* Show tip box for buyers when chat is empty */}
        {isEmptyChat && isBuyer && <ChatTipBox />}
      </div>
      
      {/* Quick message suggestions for both buyers and sellers */}
      <QuickMessageSuggestions 
        onSendQuickMessage={handleQuickMessage} 
        isBuyer={isBuyer}
      />
      
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
