
import { useState } from "react";
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
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
  status?: "active" | "inactive";
  productInfo?: {
    title: string;
    price?: string;
    isVerified?: boolean;
  };
  senderInfo?: {
    name: string;
    avatar?: string;
    isVerified?: boolean;
  };
}

const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "KTM Duke 200 bs6",
      sender: "other",
      timestamp: new Date(),
      productInfo: {
        title: "KTM Duke 200 bs6",
        price: "160000",
        isVerified: true
      },
      senderInfo: {
        name: "Ram",
        isVerified: true
      }
    },
    {
      id: "2",
      text: "Is this bike still available?",
      sender: "user",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      senderInfo: {
        name: "You"
      }
    },
    {
      id: "3",
      text: "Yes, it's available. Would you like to schedule a viewing?",
      sender: "other",
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
      senderInfo: {
        name: "Ram",
        isVerified: true
      }
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      senderInfo: {
        name: "You"
      }
    };
    
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (!isOpen) return null;

  const filters = [
    { id: "all", label: "All" },
    { id: "meeting", label: "Meeting" },
    { id: "unread", label: "Unread" },
    { id: "important", label: "Important" },
  ];

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
                  className="data-[state=active]:bg-primary data-[state=active]:text-white flex-1"
                >
                  ALL
                </TabsTrigger>
                <TabsTrigger 
                  value="buying"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white flex-1"
                >
                  BUYING
                </TabsTrigger>
                <TabsTrigger 
                  value="selling"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white flex-1"
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
                      : "hover:bg-primary/5 hover:text-primary hover:border-primary"
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
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer",
                  index !== messages.length - 1 && "border-b"
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <div className={cn(
                      "w-full h-full rounded-full flex items-center justify-center text-white",
                      message.sender === "other" ? "bg-primary" : "bg-orange-500"
                    )}>
                      {message.senderInfo?.name[0]}
                    </div>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{message.senderInfo?.name}</span>
                        {message.senderInfo?.isVerified && (
                          <Badge variant="outline" className="h-5 text-xs bg-primary/10 text-primary border-primary">
                            <Check className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {message.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    {message.productInfo && (
                      <p className="text-sm font-medium text-primary mt-1">
                        {message.productInfo.title}
                        {message.productInfo.price && ` - ₹${message.productInfo.price}`}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {message.text}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1"
              />
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRecording}
                  className={cn(
                    "hover:bg-primary hover:text-white",
                    isRecording && "text-destructive"
                  )}
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <label>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary hover:text-white"
                    type="button"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4" />
                    </span>
                  </Button>
                </label>
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="bg-primary hover:bg-primary/90 text-white"
                  disabled={!newMessage.trim() || isSending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
