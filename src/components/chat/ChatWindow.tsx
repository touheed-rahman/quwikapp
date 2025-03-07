
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { ChatFilters } from "./ChatFilters";
import { useLocation, useNavigate } from "react-router-dom";
import ConversationList from "./ConversationList";
import { useConversations } from "@/hooks/use-conversations";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "./ChatHeader";

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
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  const { 
    conversations, 
    isLoading, 
    handleDelete,
    fetchConversations,
    unreadCounts 
  } = useConversations(
    filter,
    userId,
    isAuthenticated
  );

  // Calculate unread counts by category
  const filterUnreadCounts = {
    all: Object.values(unreadCounts).reduce((sum, count) => sum + count, 0),
    buying: conversations
      .filter(c => userId === c.buyer_id)
      .reduce((sum, conv) => sum + (unreadCounts[conv.id] || 0), 0),
    selling: conversations
      .filter(c => userId === c.seller_id)
      .reduce((sum, conv) => sum + (unreadCounts[conv.id] || 0), 0)
  };

  // Re-fetch conversations when the window is opened or filter changes
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchConversations();
    }
  }, [isOpen, filter, isAuthenticated, userId, fetchConversations]);

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
    ? conversations.filter(conv => 
        conv.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.seller.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.buyer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (conv.last_message && conv.last_message.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : conversations;

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
