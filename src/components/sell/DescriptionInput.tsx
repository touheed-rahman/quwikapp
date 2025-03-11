
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const DescriptionInput = ({ value, onChange }: DescriptionInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium block flex items-center">
        <FileText className="h-4 w-4 mr-1.5 text-primary" />
        Description *
      </label>
      <Textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Include condition, features and reason for selling"
        className="min-h-[120px] resize-none border-primary/20 focus-visible:ring-primary/30 shadow-sm"
        required
      />
      <p className="text-xs text-muted-foreground">
        Be detailed and honest about your item ({value.length}/2000)
      </p>
    </div>
  );
};

export default DescriptionInput;
