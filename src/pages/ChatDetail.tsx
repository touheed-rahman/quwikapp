
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { 
  ChevronLeft,
  Phone,
  MoreVertical,
  Send,
  Mic,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface ConversationDetails {
  seller: {
    id: string;
    full_name: string;
  };
  buyer: {
    id: string;
    full_name: string;
  };
  listing: {
    title: string;
    price: number;
  };
}

const ChatDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [conversationDetails, setConversationDetails] = useState<ConversationDetails | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Save the conversation ID to localStorage before redirecting
        if (id) {
          localStorage.setItem('intended_conversation', id);
        }
        navigate('/profile');
        return;
      }
      setSessionUser(session.user);
    };
    getSession();
  }, [navigate, id]);

  useEffect(() => {
    if (!id || !sessionUser) return;

    const fetchConversationDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            seller:profiles!conversations_seller_id_fkey(id, full_name),
            buyer:profiles!conversations_buyer_id_fkey(id, full_name),
            listing:listings(title, price)
          `)
          .eq('id', id)
          .maybeSingle();

        if (error) {
          toast({
            variant: "destructive",
            title: "Error fetching conversation",
            description: error.message
          });
          return;
        }

        if (!data) {
          // Check if this was a conversation we were trying to start
          const listingId = localStorage.getItem('intended_conversation');
          if (listingId) {
            // Get the listing details first
            const { data: listing, error: listingError } = await supabase
              .from('listings')
              .select('*, profiles:user_id(*)')
              .eq('id', listingId)
              .single();

            if (listingError) {
              toast({
                variant: "destructive",
                title: "Error fetching listing",
                description: listingError.message
              });
              navigate('/');
              return;
            }

            // Create the conversation
            const { data: newConversation, error: createError } = await supabase
              .from('conversations')
              .insert({
                listing_id: listingId,
                buyer_id: sessionUser.id,
                seller_id: listing.user_id,
              })
              .select(`
                *,
                seller:profiles!conversations_seller_id_fkey(id, full_name),
                buyer:profiles!conversations_buyer_id_fkey(id, full_name),
                listing:listings(title, price)
              `)
              .single();

            if (createError) {
              toast({
                variant: "destructive",
                title: "Error creating conversation",
                description: createError.message
              });
              navigate('/');
              return;
            }

            setConversationDetails(newConversation);
            localStorage.removeItem('intended_conversation');
            return;
          }

          toast({
            variant: "destructive",
            title: "Conversation not found",
            description: "This conversation does not exist or you don't have access to it."
          });
          navigate('/');
          return;
        }

        // Check if user has access to this conversation
        if (data.buyer_id !== sessionUser.id && data.seller_id !== sessionUser.id) {
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "You don't have access to this conversation."
          });
          navigate('/');
          return;
        }

        setConversationDetails(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load conversation details"
        });
      }
    };

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching messages",
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversationDetails();
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, sessionUser, toast, navigate]);

  const handleSend = async () => {
    if (!newMessage.trim() || !sessionUser || !id) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: id,
          sender_id: sessionUser.id,
          content: newMessage
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error.message
      });
    }
  };

  if (!sessionUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <p className="text-lg mb-4">Please sign in to view this chat</p>
        <Button onClick={() => navigate('/profile')}>Sign In</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="hover:bg-transparent"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        {conversationDetails && (
          <>
            <Avatar className="h-10 w-10">
              <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white">
                {conversationDetails.seller.full_name[0]}
              </div>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{conversationDetails.seller.full_name}</span>
                <Badge variant="outline" className="h-5 bg-primary/10 text-primary border-primary">
                  Verified
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{conversationDetails.listing.title}</span>
                <span className="text-sm font-medium">₹{conversationDetails.listing.price}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === sessionUser.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender_id === sessionUser.id 
                  ? "bg-blue-100 text-blue-900" 
                  : "bg-white border"
              }`}
            >
              <p>{message.content}</p>
              <div className={`text-xs mt-1 ${
                message.sender_id === sessionUser.id 
                  ? "text-blue-700" 
                  : "text-muted-foreground"
              }`}>
                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type here"
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button variant="ghost" size="icon">
            <Mic className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;

