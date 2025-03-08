
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useBlockedUsers } from "@/hooks/use-blocked-users";
import NotSignedInView from "@/components/chat/NotSignedInView";
import ChatLoadingView from "@/components/chat/ChatLoadingView";
import ChatActionsMenu from "@/components/chat/ChatActionsMenu";
import BlockUserDialog from "@/components/chat/BlockUserDialog";
import ReportDialog from "@/components/chat/ReportDialog";

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { onlineUsers } = useOnlineUsers();
  
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  
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

  const { blockUser } = useBlockedUsers(sessionUser?.id);

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
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      // Direct delete approach - with a check to ensure only own messages can be deleted
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', sessionUser?.id || ''); // Ensure only own messages can be deleted

      if (error) throw error;
      
      toast({
        title: "Message deleted",
        description: "Your message has been deleted."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting message",
        description: error.message || "Failed to delete message"
      });
    }
  };

  const handleReportMessage = async (messageId: string, reason: string) => {
    try {
      // Add a report message to the conversation
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: id,
          sender_id: sessionUser?.id,
          content: `REPORT: ${reason}`,
          is_report: true,
          reported_message_id: messageId
        });

      if (error) throw error;
      
      toast({
        title: "Message reported",
        description: "Thank you for helping keep our community safe."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error reporting message",
        description: error.message || "Failed to report message"
      });
    }
  };

  const handleBlockUser = async () => {
    if (!conversationDetails || !sessionUser || !id) return;
    
    // Determine the user to block
    const otherUserId = sessionUser.id === conversationDetails.buyer_id 
      ? conversationDetails.seller_id 
      : conversationDetails.buyer_id;
    
    const success = await blockUser(otherUserId, id);
    
    if (success) {
      navigate('/chat'); // Go back to chat list
    }
  };

  if (!sessionUser) {
    return <NotSignedInView />;
  }

  if (isLoading) {
    return <ChatLoadingView />;
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
      <div className="flex items-center justify-between">
        <ChatDetailHeader 
          conversationDetails={conversationDetails} 
          onBack={handleBack}
          isOnline={isOtherUserOnline}
        />
        
        <ChatActionsMenu 
          onBlockUser={() => setBlockDialogOpen(true)}
          onReportConversation={() => setReportDialogOpen(true)}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <MessageList 
          messages={messages} 
          sessionUserId={sessionUser.id} 
          onDeleteMessage={handleDeleteMessage}
          onReportMessage={handleReportMessage}
        />
        
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
      
      {/* Block User Dialog */}
      <BlockUserDialog 
        open={blockDialogOpen} 
        onOpenChange={setBlockDialogOpen} 
        onConfirm={handleBlockUser} 
      />
      
      {/* Report Conversation Dialog */}
      <ReportDialog 
        open={reportDialogOpen} 
        onOpenChange={setReportDialogOpen}
        conversationId={id}
        sessionUserId={sessionUser.id}
      />
    </div>
  );
};

export default ChatDetail;
