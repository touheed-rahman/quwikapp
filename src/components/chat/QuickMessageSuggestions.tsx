
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-background/95 backdrop-blur-sm border-t"
    >
      <ScrollArea className="py-2 px-1">
        <div className="flex gap-2 px-2 pb-1 flex-wrap">
          {quickMessages.map((message) => (
            <Button
              key={message}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-sm py-1.5 px-3 h-auto rounded-full bg-white hover:bg-primary/10 hover:text-primary flex-shrink-0 transition-all"
              onClick={() => onSendQuickMessage(message)}
            >
              {message}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default QuickMessageSuggestions;
