
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useConversations } from "@/hooks/use-conversations";
import { useSessionUser } from "@/hooks/use-session-user";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatFilters } from "@/components/chat/ChatFilters";
import ConversationList from "@/components/chat/ConversationList";
import MobileNavigation from "@/components/navigation/MobileNavigation"; // Fixed import

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionUser } = useSessionUser();
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling'>('all');
  
  // Use proper arguments for useConversations
  const { 
    conversations, 
    isLoading, 
    unreadCounts, 
    handleDelete,
    fetchConversations 
  } = useConversations(
    filter, 
    sessionUser?.id || null, 
    !!sessionUser
  );

  const handleFilterChange = (newFilter: 'all' | 'buying' | 'selling') => {
    setFilter(newFilter);
  };

  if (!sessionUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <p className="text-lg mb-4">Please sign in to access your chats</p>
        <button 
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => navigate('/profile')}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      {/* Fixed ChatHeader props to match component definition */}
      <ChatHeader onClose={() => navigate('/')} title="Chats" />
      
      {/* Fixed ChatFilters props to match component definition */}
      <ChatFilters 
        filter={filter}
        onFilterChange={handleFilterChange}
      />
      
      <div className="flex-1 overflow-hidden">
        <ConversationList 
          conversations={conversations}
          isLoading={isLoading}
          onDelete={handleDelete}
          onSelectConversation={(conversationId) => navigate(`/chat/${conversationId}`)}
          unreadCounts={unreadCounts}
          userId={sessionUser.id}
        />
      </div>
      <MobileNavigation onChatOpen={() => {}} pathname={location.pathname} />
    </div>
  );
};

export default Chat;
