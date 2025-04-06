import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import ConversationList from "./ConversationList";
import { useConversations } from "@/hooks/use-conversations";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "./ChatHeader";
import { ChatFilters } from "./ChatFilters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button"; 
import { Search, Filter, ArrowUpDown, Loader2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
      console.log("Auth check - User ID:", session?.user?.id);
    };
    
    checkAuth();

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

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/chat/')) {
      const id = path.split('/').pop();
      if (id) {
        setSelectedConversationId(id);
      }
    } else {
      setSelectedConversationId(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen && isAuthenticated && userId) {
      console.log('Chat window opened or filter changed, refreshing conversations');
      refreshConversations();
    }
  }, [isOpen, filter, isAuthenticated, userId, refreshConversations]);

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

  const handleToggleSort = () => {
    setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest');
  };

  const handleToggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  const handleSelectConversation = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId);
    onClose();
  }, [onClose]);

  const sortConversations = (conversations: any[]) => {
    return [...conversations].sort((a, b) => {
      const dateA = new Date(a.last_message_at || a.created_at || Date.now()).getTime();
      const dateB = new Date(b.last_message_at || b.created_at || Date.now()).getTime();
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });
  };

  let filteredConversations = searchTerm.trim() 
    ? filterConversations(searchTerm)
    : conversations;
    
  filteredConversations = sortConversations(filteredConversations);

  console.log("Chat window rendering with", conversations.length, "conversations");
  console.log("Filtered to", filteredConversations.length, "conversations");

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card 
      className={`fixed inset-y-0 right-0 w-full sm:w-[400px] flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } shadow-xl`}
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
      
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 gap-1 text-xs"
            onClick={handleToggleSort}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortOrder === 'latest' ? 'Latest first' : 'Oldest first'}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-7 gap-1 text-xs", showAdvancedSearch && "bg-primary/20")}
            onClick={handleToggleAdvancedSearch}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {showAdvancedSearch && (
        <div className="px-4 py-2 border-b space-y-2 bg-muted/10">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search by name, product or message..." 
              className="pl-8 h-8 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading conversations...</span>
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg">No conversations yet</h3>
          <p className="text-muted-foreground text-sm mt-1">
            {searchTerm ? 
              "No conversations match your search criteria." : 
              "Start chatting by viewing a listing and messaging the seller."}
          </p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Browse Listings
          </Button>
        </div>
      ) : (
        <ConversationList 
          conversations={filteredConversations}
          isLoading={isLoading}
          onDelete={handleDelete}
          onSelectConversation={handleSelectConversation}
          unreadCounts={unreadCounts}
          userId={userId}
          selectedConversationId={selectedConversationId}
        />
      )}
      
      <footer className="mt-auto border-t p-3">
        <div className="text-xs text-center text-muted-foreground">
          Messages are for arranging purchases only. Be wary of users asking to pay outside the app.
        </div>
      </footer>
    </Card>
  );
};

export default ChatWindow;
