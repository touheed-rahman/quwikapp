
import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import ConversationList from "./ConversationList";
import { useConversations } from "@/hooks/use-conversations";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "./ChatHeader";
import { ChatFilters } from "./ChatFilters";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Check authentication state
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
      console.log("Auth check - User ID:", session?.user?.id);
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
      console.log("Auth state change - User ID:", session?.user?.id);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  const { 
    conversations, 
    isLoading, 
    handleDelete,
    refreshConversations,
    unreadCounts,
    filterUnreadCounts,
    filterConversations
  } = useConversations(
    filter,
    userId,
    isAuthenticated
  );

  // Force refresh when chat window opens, filter changes, or auth state changes
  useEffect(() => {
    if (isOpen && isAuthenticated && userId) {
      console.log('Chat window opened or filter changed, refreshing conversations');
      refreshConversations();
    }
  }, [isOpen, filter, isAuthenticated, userId, refreshConversations]);

  // Additional refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated && userId && isOpen) {
        console.log('Tab became visible, refreshing conversations');
        refreshConversations();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, userId, refreshConversations, isOpen]);

  // Periodic refresh every 30 seconds when window is open
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOpen && isAuthenticated && userId) {
      interval = setInterval(() => {
        console.log('Periodic refresh of conversations');
        refreshConversations();
      }, 30000); // Every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isAuthenticated, userId, refreshConversations]);

  const handleFilterChange = (newFilter: 'all' | 'buying' | 'selling') => {
    setFilter(newFilter);
  };

  const handleClose = () => {
    onClose();
    if (location.pathname.includes('/chat/')) {
      navigate('/');
    }
  };

  const handleSelectConversation = useCallback(() => {
    onClose();
  }, [onClose]);

  // Filter conversations based on search term
  const filteredConversations = searchTerm.trim() 
    ? filterConversations(searchTerm)
    : conversations;

  console.log("Chat window rendering with", conversations.length, "conversations");
  console.log("Filtered to", filteredConversations.length, "conversations");

  if (isAuthenticated === null) {
    return null; // Don't render anything while checking auth
  }

  if (!isAuthenticated) {
    return null; // Don't show the chat window if not authenticated
  }

  return (
    <Card 
      className={`fixed inset-y-0 right-0 w-full sm:w-[400px] flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <ChatHeader 
        onClose={handleClose}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <ChatFilters 
        filter={filter}
        onFilterChange={handleFilterChange}
        unreadCounts={filterUnreadCounts}
      />

      <ConversationList 
        conversations={filteredConversations}
        isLoading={isLoading}
        onDelete={handleDelete}
        onSelectConversation={handleSelectConversation}
        unreadCounts={unreadCounts}
        userId={userId}
      />
    </Card>
  );
};

export default ChatWindow;
