
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TitleInput = ({ value, onChange }: TitleInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium block flex items-center">
        <Tag className="h-4 w-4 mr-1.5 text-primary" />
        Ad title *
      </label>
      <Input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Mention the key features of your item (e.g. brand, model, age, type)"
        className="border-primary/20 focus-visible:ring-primary/30 shadow-sm"
        required 
      />
      <p className="text-xs text-muted-foreground">
        A good title helps your item get noticed ({value.length}/100)
      </p>
    </div>
  );
};

export default TitleInput;
