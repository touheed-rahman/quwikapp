
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { onlineUsers } = useOnlineUsers();
  
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  
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

  const handleDeleteMessage = async (messageId: string) => {
    try {
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
      const { error } = await supabase
        .from('reports')
        .insert({
          message_id: messageId,
          user_id: sessionUser?.id,
          reason: reason,
          conversation_id: id
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
    if (!conversationDetails || !sessionUser) return;
    
    // Determine the user to block
    const otherUserId = sessionUser.id === conversationDetails.buyer_id 
      ? conversationDetails.seller_id 
      : conversationDetails.buyer_id;
    
    try {
      // Insert a record in the blocked_users table
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          blocker_id: sessionUser.id,
          blocked_id: otherUserId
        });

      if (error) throw error;
      
      toast({
        title: "User blocked",
        description: "You will no longer receive messages from this user."
      });
      
      navigate('/chat'); // Go back to chat list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error blocking user",
        description: error.message || "Failed to block user"
      });
    }
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
      <div className="flex items-center justify-between">
        <ChatDetailHeader 
          conversationDetails={conversationDetails} 
          onBack={handleBack}
          isOnline={isOtherUserOnline}
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Shield className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive" 
              onClick={() => setBlockDialogOpen(true)}
            >
              <Shield className="mr-2 h-4 w-4" />
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Block User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block this user? You will no longer receive messages from them, and they won't be able to contact you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBlockUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Block User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatDetail;
