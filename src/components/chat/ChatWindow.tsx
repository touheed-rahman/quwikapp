
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, MoreVertical, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "./ChatHeader";
import { ConversationItem } from "./ConversationItem";
import { ChatFilters } from "./ChatFilters";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "../ui/use-toast";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  email?: string;
}

interface ListingDetails {
  id: string;
  title: string;
  price: number;
  status: string;
}

interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  listing: ListingDetails;
  seller: Profile;
  buyer: Profile;
}

const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling'>('all');
  const [activeTab, setActiveTab] = useState('all');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, [filter]);

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      let query = supabase
        .from('conversations')
        .select(`
          id,
          buyer_id,
          seller_id,
          listing_id,
          last_message,
          last_message_at,
          created_at,
          updated_at,
          deleted,
          listing:listings(id, title, price, status),
          seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url, email),
          buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url, email)
        `)
        .eq('deleted', false)
        .order('last_message_at', { ascending: false });

      if (filter === 'buying') {
        query = query.eq('buyer_id', user.id);
      } else if (filter === 'selling') {
        query = query.eq('seller_id', user.id);
      } else {
        query = query.or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to match our Conversation type
      const typedConversations: Conversation[] = (data || []).map(conv => ({
        id: conv.id,
        buyer_id: conv.buyer_id,
        seller_id: conv.seller_id,
        listing_id: conv.listing_id,
        last_message: conv.last_message,
        last_message_at: conv.last_message_at,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        deleted: conv.deleted || false,
        listing: conv.listing,
        seller: conv.seller,
        buyer: conv.buyer
      }));

      setConversations(typedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (conversationId: string) => {
    try {
      const updates = {
        deleted: true
      };

      const { error: updateError } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', conversationId);

      if (updateError) throw updateError;

      toast({
        title: "Chat deleted",
        description: "The conversation has been deleted successfully."
      });

      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (location.pathname.includes('/chat/')) {
        navigate('/chat');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete the conversation. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={`fixed inset-y-0 right-0 w-full sm:w-[400px] flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ChatFilters 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filter={filter}
        onFilterChange={setFilter}
      />

      <ScrollArea className="flex-1">
        {conversations.map((conversation) => (
          <div key={conversation.id} className="group relative">
            <ConversationItem
              conversation={conversation}
              onClick={() => {
                if (location.pathname === '/chat') {
                  navigate(`/chat/${conversation.id}`);
                } else {
                  setActiveConversation(conversation.id);
                }
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDelete(conversation.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
};

export default ChatWindow;
