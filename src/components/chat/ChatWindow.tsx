
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mic, 
  MicOff, 
  Upload, 
  Send, 
  X, 
  Search,
  MoreVertical 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
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
}

const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "KTM Duke 200 bs6",
      sender: "other",
      timestamp: new Date(),
      productInfo: {
        title: "KTM Duke 200 bs6",
        price: "160000",
        isVerified: true
      }
    },
    {
      id: "2",
      text: "Is this bike still available?",
      sender: "user",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
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
    // Handle recording logic here
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
          <div className="border-b p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-xl">Chats</h3>
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-primary hover:text-white"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="px-4 pt-2">
              <TabsList className="w-full justify-start gap-2 h-auto p-1">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  ALL
                </TabsTrigger>
                <TabsTrigger 
                  value="buying"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  BUYING
                </TabsTrigger>
                <TabsTrigger 
                  value="selling"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  SELLING
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="px-4 pt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-full",
                    activeFilter === filter.id && "bg-primary text-white hover:bg-primary/90"
                  )}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </Tabs>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col max-w-[85%] space-y-1",
                  message.sender === "user" ? "ml-auto items-end" : "items-start"
                )}
              >
                {message.productInfo && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 w-full">
                    <div className="w-12 h-12 bg-muted rounded-md shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{message.productInfo.title}</p>
                      {message.productInfo.price && (
                        <p className="text-sm text-muted-foreground">₹{message.productInfo.price}</p>
                      )}
                    </div>
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm",
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-muted"
                  )}
                >
                  {message.text}
                </div>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>

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

