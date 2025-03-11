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
import { motion } from "framer-motion";

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
    disabledReason,
    handleImageUpload
  } = useChat(id);

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
    navigate('/');
  };

  const handleQuickMessage = (message: string) => {
    setNewMessage(message);
    // Optional: automatically send the message
    // setTimeout(() => handleSend(), 100);
  };

  const handleUploadImage = async (file: File) => {
    if (!sessionUser || !id) return;
    
    try {
      const filename = `${Date.now()}-${file.name}`;
      const filePath = `chat_images/${id}/${filename}`;
      
      const { error: uploadError } = await supabase.storage
        .from('chat_images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('chat_images')
        .getPublicUrl(filePath);
        
      if (handleImageUpload) {
        handleImageUpload(urlData.publicUrl);
      }
      
      toast({
        title: "Image uploaded",
        description: "Your image has been sent successfully.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload image"
      });
    }
  };

  if (!sessionUser) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-lg mb-4">Please sign in to view this chat</p>
        <Button onClick={() => navigate('/profile')}>Sign In</Button>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div 
        className="flex items-center justify-center h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading conversation...</p>
        </div>
      </motion.div>
    );
  }

  const otherUserId = conversationDetails 
    ? (sessionUser.id === conversationDetails.buyer_id 
      ? conversationDetails.seller_id 
      : conversationDetails.buyer_id)
    : null;
  
  const isOtherUserOnline = otherUserId ? onlineUsers.has(otherUserId) : false;
  const isBuyer = conversationDetails && sessionUser.id === conversationDetails.buyer_id;
  const isEmptyChat = messages.length === 0;

  return (
    <motion.div 
      className="flex flex-col h-[100dvh] bg-gradient-to-b from-background to-primary/5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ChatDetailHeader 
        conversationDetails={conversationDetails} 
        onBack={handleBack}
        isOnline={isOtherUserOnline}
        sessionUserId={sessionUser.id}
      />
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} sessionUserId={sessionUser.id} />
        
        {isEmptyChat && isBuyer && <ChatTipBox />}
      </div>
      
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
        onImageUpload={handleUploadImage}
      />
    </motion.div>
  );
};

export default ChatDetail;
