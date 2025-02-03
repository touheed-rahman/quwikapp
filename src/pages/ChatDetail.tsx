
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { 
  ChevronLeft,
  Phone,
  MoreVertical,
  Send,
  Mic
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

const ChatDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi, I am interested in your ad posting.",
      sender: "user" as const,
      timestamp: new Date(2024, 0, 31, 12, 26)
    },
    {
      id: "2",
      text: "how many months emi pending bro?",
      sender: "user" as const,
      timestamp: new Date(2024, 0, 31, 12, 26)
    },
    {
      id: "3",
      text: "130k emi pending",
      sender: "other" as const,
      timestamp: new Date(2024, 0, 31, 12, 27)
    },
    {
      id: "4",
      text: "U r paying emi from the bike amount?",
      sender: "user" as const,
      timestamp: new Date(2024, 0, 31, 17, 14)
    },
    {
      id: "5",
      text: "S",
      sender: "other" as const,
      timestamp: new Date(2024, 0, 31, 17, 51)
    }
  ]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user" as const,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const quickReplies = [
    "Hello",
    "Is it available?",
    "Okay",
    "No problem",
    "Please reply",
    "Not interested"
  ];

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
        
        <Avatar className="h-10 w-10">
          <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white">
            R
          </div>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Ram</span>
            <Badge variant="outline" className="h-5 bg-primary/10 text-primary border-primary">
              Verified
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">KTM Duke 200 bs6</span>
            <span className="text-sm font-medium">₹90,000</span>
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
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <div className="text-center text-sm text-muted-foreground">
          Friday, 31 Jan
        </div>
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === "user" 
                  ? "bg-blue-100 text-blue-900" 
                  : "bg-white border"
              }`}
            >
              <p>{message.text}</p>
              <div className={`text-xs mt-1 ${
                message.sender === "user" 
                  ? "text-blue-700" 
                  : "text-muted-foreground"
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Replies */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {quickReplies.map((reply) => (
            <Button
              key={reply}
              variant="outline"
              className="whitespace-nowrap"
              onClick={() => setNewMessage(reply)}
            >
              {reply}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-2">
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
