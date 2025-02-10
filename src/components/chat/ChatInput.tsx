
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Mic } from "lucide-react";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSend: () => void;
}

const ChatInput = ({ newMessage, setNewMessage, handleSend }: ChatInputProps) => {
  return (
    <div className="p-4 bg-white border-t">
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type here"
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="ghost" size="icon" className="hidden md:inline-flex">
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
  );
};

export default ChatInput;

