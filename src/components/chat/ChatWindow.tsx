
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { 
  Mic, 
  MicOff, 
  Upload, 
  Send, 
  X, 
  Search,
  MoreVertical,
  Check,
  Phone,
  Image,
  Smile
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  initialSeller?: {
    name: string;
    isVerified?: boolean;
    productInfo?: {
      title: string;
      price?: string;
    }
  };
}

interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender_info?: {
    name: string;
    avatar?: string;
    isVerified?: boolean;
  };
}

interface Conversation {
  id: string;
  listing_id: string;
  last_message: string;
  last_message_at: string;
  seller_id: string;
  buyer_id: string;
  listing: {
    title: string;
    price: number;
  };
  seller: {
    full_name: string;
    avatar_url?: string;
  };
}

const ChatWindow = ({ isOpen, onClose, initialSeller }: ChatWindowProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionUser(session?.user);
    };
    getSession();
  }, []);

  useEffect(() => {
    if (!sessionUser) return;

    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(title, price),
          seller:profiles!conversations_seller_id_fkey(full_name, avatar_url)
        `)
        .or(`buyer_id.eq.${sessionUser.id},seller_id.eq.${sessionUser.id}`)
        .order('last_message_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching conversations",
          description: error.message
        });
        return;
      }

      setConversations(data || []);
    };

    fetchConversations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `buyer_id=eq.${sessionUser.id}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setConversations(prev => 
              prev.map(conv => 
                conv.id === payload.new.id 
                  ? { ...conv, ...payload.new }
                  : conv
              )
            );
          } else if (payload.eventType === 'INSERT') {
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionUser, toast]);

  const handleSend = async () => {
    if (!newMessage.trim() || !sessionUser) return;
    
    setIsSending(true);
    
    try {
      // First, ensure we have a conversation
      let conversationId = conversations[0]?.id;
      
      if (!conversationId && initialSeller) {
        // Create a new conversation
        const { data: newConversation, error: convError } = await supabase
          .from('conversations')
          .insert({
            listing_id: initialSeller.productInfo?.title,
            buyer_id: sessionUser.id,
            seller_id: initialSeller.id
          })
          .select()
          .single();

        if (convError) throw convError;
        conversationId = newConversation.id;
      }

      // Send the message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: sessionUser.id,
          content: newMessage
        });

      if (messageError) throw messageError;
      
      setNewMessage("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error.message
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleAvatarClick = (conversationId: string) => {
    onClose();
    navigate(`/chat/${conversationId}`);
  };

  if (!isOpen) return null;

  const filters = [
    { id: "all", label: "All" },
    { id: "meeting", label: "Meeting" },
    { id: "unread", label: "Unread" },
    { id: "important", label: "Important" },
  ];

  if (!sessionUser) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg">
          <div className="flex flex-col items-center justify-center h-full p-4">
            <p className="text-lg mb-4">Please sign in to use chat</p>
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg animate-in slide-in-from-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <h3 className="font-semibold text-xl">Chats</h3>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search chats..." 
                  className="pl-9 h-9 bg-muted/50"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <div className="px-4 pt-2">
              <TabsList className="w-full justify-start gap-2 h-auto p-1">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white flex-1"
                >
                  ALL
                </TabsTrigger>
                <TabsTrigger 
                  value="buying"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white flex-1"
                >
                  BUYING
                </TabsTrigger>
                <TabsTrigger 
                  value="selling"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white flex-1"
                >
                  SELLING
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Quick Filters */}
            <div className="px-4 pt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-full",
                    activeFilter === filter.id 
                      ? "bg-primary/10 text-primary border-primary" 
                      : "hover:bg-primary/5 hover:text-white hover:border-primary"
                  )}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </Tabs>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation, index) => (
              <div
                key={conversation.id}
                className={cn(
                  "px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer",
                  index !== conversations.length - 1 && "border-b"
                )}
                onClick={() => handleAvatarClick(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <div className={cn(
                      "w-full h-full rounded-full flex items-center justify-center text-white",
                      sessionUser.id === conversation.buyer_id ? "bg-primary" : "bg-orange-500"
                    )}>
                      {conversation.seller.full_name[0]}
                    </div>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{conversation.seller.full_name}</span>
                        <Badge variant="outline" className="h-5 text-xs bg-primary/10 text-primary border-primary">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(conversation.last_message_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary mt-1">
                      {conversation.listing.title}
                      {conversation.listing.price && ` - ₹${conversation.listing.price}`}
                    </p>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {conversation.last_message}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
