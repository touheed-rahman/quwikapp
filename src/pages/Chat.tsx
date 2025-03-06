
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useConversations } from "@/hooks/use-conversations";
import { useSessionUser } from "@/hooks/use-session-user";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatFilters } from "@/components/chat/ChatFilters";
import ConversationList from "@/components/chat/ConversationList";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionUser } = useSessionUser();
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling'>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
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

  const handleQuickFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // Additional filtering logic can be added here
  };

  const handleSelectConversation = (conversationId: string) => {
    // Mark messages as read or other actions before navigating
    navigate(`/chat/${conversationId}`);
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
      <ChatHeader onBack={() => navigate('/')} title="Chats" />
      <ChatFilters 
        filter={filter}
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
        onQuickFilterChange={handleQuickFilterChange}
      />
      <div className="flex-1 overflow-hidden">
        <ConversationList 
          conversations={conversations}
          isLoading={isLoading}
          onDelete={handleDelete}
          onSelectConversation={handleSelectConversation}
          unreadCounts={unreadCounts}
          userId={sessionUser.id}
        />
      </div>
      <MobileNavigation onChatOpen={() => {}} pathname={location.pathname} />
    </div>
  );
};

export default Chat;
