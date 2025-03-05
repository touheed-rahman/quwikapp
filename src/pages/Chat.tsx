
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useSessionUser } from '@/hooks/use-session-user';
import { useConversations } from '@/hooks/use-conversations';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatFilters from '@/components/chat/ChatFilters';
import ConversationList from '@/components/chat/ConversationList';
import { Loader2 } from "lucide-react";
import MobileNavigation from '@/components/navigation/MobileNavigation';

const Chat = () => {
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling'>('all');
  const { sessionUser } = useSessionUser(undefined);
  const userId = sessionUser?.id || null;
  const isAuthenticated = !!sessionUser;
  
  const { 
    conversations, 
    isLoading, 
    unreadCounts, 
    handleDelete,
    fetchConversations
  } = useConversations(filter, userId, isAuthenticated);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Chats</title>
      </Helmet>
      <div className="flex flex-col min-h-[100dvh]">
        <ChatHeader />
        <ChatFilters filter={filter} onFilterChange={setFilter} />
        <div className="flex-1 overflow-y-auto pb-16">
          <ConversationList 
            conversations={conversations} 
            onDelete={handleDelete} 
            unreadCounts={unreadCounts}
          />
          
          {conversations.length === 0 && (
            <div className="text-center py-10 px-4">
              <h3 className="text-lg font-medium text-gray-700">No conversations yet</h3>
              <p className="text-gray-500 mt-2">
                When you message a seller or receive a message, your conversations will appear here.
              </p>
            </div>
          )}
        </div>
        <MobileNavigation />
      </div>
    </>
  );
};

export default Chat;
