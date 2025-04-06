
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuickMessageSuggestionsProps {
  onSendQuickMessage: (message: string) => void;
  isBuyer: boolean;
}

const QuickMessageSuggestions: React.FC<QuickMessageSuggestionsProps> = ({ 
  onSendQuickMessage, 
  isBuyer 
}) => {
  const buyerMessages = [
    "Hello",
    "Is it available?",
    "Can you provide more details?",
    "What's your best price?",
    "Can we meet?",
    "Where are you located?",
    "I'm interested",
    "Thanks"
  ];

  const sellerMessages = [
    "Yes, it's available",
    "Thanks for your interest",
    "When would you like to meet?",
    "I can deliver it",
    "The price is negotiable",
    "Do you have any questions?",
    "Sorry, it's on hold",
    "It's still available"
  ];

  const quickMessages = isBuyer ? buyerMessages : sellerMessages;

  return (
    <ScrollArea className="bg-background/80 backdrop-blur-sm border-t">
      <div className="flex overflow-x-auto py-2 px-2 max-w-full mx-auto">
        <div className="flex gap-2 px-1 flex-nowrap min-w-full">
          {quickMessages.map((message) => (
            <Button
              key={message}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-sm py-1.5 px-3 h-auto rounded-full bg-white hover:bg-primary/5 flex-shrink-0"
              onClick={() => onSendQuickMessage(message)}
            >
              {message}
            </Button>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default QuickMessageSuggestions;
