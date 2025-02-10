
import { Input } from "@/components/ui/input";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TitleInput = ({ value, onChange }: TitleInputProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">
        Ad title *
      </label>
      <Input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Mention the key features of your item (e.g. brand, model, age, type)"
        required 
      />
    </div>
  );
};

export default TitleInput;
