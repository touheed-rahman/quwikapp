
import { Textarea } from "@/components/ui/textarea";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const DescriptionInput = ({ value, onChange }: DescriptionInputProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">
        Description *
      </label>
      <Textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Include condition, features and reason for selling"
        className="min-h-[120px] resize-none"
        required
      />
    </div>
  );
};

export default DescriptionInput;
