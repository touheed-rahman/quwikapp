
import React from 'react';
import { Button } from "@/components/ui/button";

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
    "Okay",
    "No problem",
    "Please reply",
    "Not interested"
  ];

  const sellerMessages = [
    "Yes, it's available",
    "Are you interested?",
    "When would you like to meet?",
    "Thank you for your interest",
    "The price is negotiable",
    "I can deliver it"
  ];

  const quickMessages = isBuyer ? buyerMessages : sellerMessages;

  return (
    <div className="p-4 bg-background border-t">
      <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
        {quickMessages.map((message) => (
          <Button
            key={message}
            variant="outline"
            size="sm"
            className="whitespace-nowrap text-sm py-2 px-4 h-auto rounded-full bg-white hover:bg-primary/5"
            onClick={() => onSendQuickMessage(message)}
          >
            {message}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickMessageSuggestions;
