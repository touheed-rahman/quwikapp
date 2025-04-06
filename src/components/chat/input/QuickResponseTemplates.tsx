
import { Button } from "@/components/ui/button";

interface QuickResponseTemplatesProps {
  onSelectTemplate: (template: string) => void;
}

const QuickResponseTemplates = ({ onSelectTemplate }: QuickResponseTemplatesProps) => {
  const templates = [
    "Is this still available?",
    "What's your best price?",
    "Where are you located?",
    "Can I see more photos?",
    "When can we meet?",
    "Can you deliver?",
    "What's the condition?",
    "How long have you had this?"
  ];
  
  return (
    <div className="grid grid-cols-2 gap-2 p-1">
      {templates.map((template, idx) => (
        <Button 
          key={idx}
          variant="ghost" 
          size="sm"
          className="h-auto py-1.5 justify-start text-left text-sm font-normal"
          onClick={() => onSelectTemplate(template)}
        >
          {template}
        </Button>
      ))}
    </div>
  );
};

export default QuickResponseTemplates;
