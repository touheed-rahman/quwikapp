
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { ChatFilters } from "./ChatFilters";
import { useLocation, useNavigate } from "react-router-dom";
import ConversationList from "./ConversationList";
import { useConversations } from "@/hooks/use-conversations";
import { supabase } from "@/integrations/supabase/client";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling'>('all');
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
  
  const { conversations, isLoading, handleDelete, fetchConversations } = useConversations(
    filter,
    userId,
    isAuthenticated
  );

  // Re-fetch conversations when the window is opened
  useEffect(() => {
    if (isOpen && isAuthenticated && userId) {
      fetchConversations();
    }
  }, [isOpen, isAuthenticated, userId, fetchConversations]);

  const handleFilterChange = (newFilter: 'all' | 'buying' | 'selling') => {
    setFilter(newFilter);
  };

  const handleClose = () => {
    onClose();
    if (location.pathname.includes('/chat/')) {
      navigate('/');
    }
  };

  const handleSelectConversation = () => {
    onClose();
  };

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
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ChatFilters 
        activeTab={filter}
        setActiveTab={setFilter}
        filter={filter}
        onFilterChange={handleFilterChange}
      />

      <ConversationList 
        conversations={conversations}
        isLoading={isLoading}
        onDelete={handleDelete}
        onSelectConversation={handleSelectConversation}
      />
    </Card>
  );
};

export default ChatWindow;
