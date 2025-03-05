
import React from 'react';
import { Button } from "@/components/ui/button";

interface QuickMessageSuggestionsProps {
  onSendQuickMessage: (message: string) => void;
}

const QuickMessageSuggestions: React.FC<QuickMessageSuggestionsProps> = ({ onSendQuickMessage }) => {
  const quickMessages = [
    "Hello",
    "Is it available?",
    "Okay",
    "No problem",
    "Please reply",
    "Not interested"
  ];

  return (
    <div className="p-2 overflow-x-auto flex gap-2 bg-background border-t">
      {quickMessages.map((message) => (
        <Button
          key={message}
          variant="outline"
          size="sm"
          className="whitespace-nowrap text-xs py-1 px-3 h-auto rounded-full bg-white hover:bg-primary/5"
          onClick={() => onSendQuickMessage(message)}
        >
          {message}
        </Button>
      ))}
    </div>
  );
};

export default QuickMessageSuggestions;
