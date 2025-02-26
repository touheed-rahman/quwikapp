
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChatHeader } from "./components/ChatHeader";
import { ConversationList } from "./components/ConversationList";
import { ChatFilters } from "./ChatFilters";
import { ChatFilter } from "./types/chat-window";
import { useConversations } from "./hooks/useConversations";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [filter, setFilter] = useState<ChatFilter>('all');
  
  const {
    conversations,
    setConversations,
    isLoading,
    isAuthenticated
  } = useConversations(isOpen, filter);

  const handleFilterChange = (newFilter: ChatFilter) => {
    setFilter(newFilter);
  };

  const handleDelete = async (conversationId: string) => {
    try {
      await supabase
        .from('conversations')
        .update({ deleted: true })
        .eq('id', conversationId);

      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (location.pathname.includes(`/chat/${conversationId}`)) {
        navigate('/chat');
      }

      toast({
        title: "Success",
        description: "Chat deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete conversation"
      });
    }
  };

  if (isAuthenticated === null || !isAuthenticated) {
    return null;
  }

  return (
    <Card 
      className={`fixed inset-y-0 right-0 w-full sm:w-[400px] flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <ChatHeader onClose={onClose} />
      <ChatFilters 
        activeTab={filter}
        setActiveTab={handleFilterChange}
        filter={filter}
        onFilterChange={handleFilterChange}
      />
      <ConversationList
        conversations={conversations}
        isLoading={isLoading}
        onConversationClick={(id) => {
          navigate(`/chat/${id}`);
          onClose();
        }}
        onDelete={handleDelete}
      />
    </Card>
  );
};

export default ChatWindow;
