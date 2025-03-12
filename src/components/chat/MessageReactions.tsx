
import { useState } from "react";
import { Heart, ThumbsUp, X, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MessageReactionProps {
  messageId: string;
  onReact?: (messageId: string, reaction: string) => void;
  existingReactions?: Record<string, number>;
}

const REACTIONS = [
  { emoji: "👍", count: 0 },
  { emoji: "❤️", count: 0 },
  { emoji: "😂", count: 0 },
  { emoji: "😮", count: 0 },
  { emoji: "😢", count: 0 },
  { emoji: "🙏", count: 0 },
];

const MessageReactions = ({ messageId, onReact, existingReactions = {} }: MessageReactionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);

  const handleReaction = (reaction: string) => {
    setUserReaction(reaction);
    if (onReact) {
      onReact(messageId, reaction);
    }
    setIsOpen(false);
  };

  return (
    <div className="flex items-center mt-1">
      {userReaction && (
        <div className="inline-flex items-center mr-2 px-1.5 py-0.5 bg-primary/10 rounded-full text-xs">
          <span className="mr-0.5">{userReaction}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 ml-0.5" 
            onClick={() => setUserReaction(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "h-6 rounded-full text-xs px-2", 
              userReaction ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Smile className="h-3 w-3 mr-1" />
            React
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1" align="start">
          <div className="flex gap-1">
            {REACTIONS.map(reaction => {
              const count = existingReactions[reaction.emoji] || 0;
              return (
                <Button
                  key={reaction.emoji}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 relative"
                  onClick={() => handleReaction(reaction.emoji)}
                >
                  {reaction.emoji}
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 text-[10px] bg-primary text-white rounded-full h-4 w-4 flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MessageReactions;
