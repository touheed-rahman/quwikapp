
import { Input } from "@/components/ui/input";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PriceInput = ({ value, onChange }: PriceInputProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">
        Price *
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
        <Input 
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-8" 
          placeholder="Enter price"
          required
        />
      </div>
    </div>
  );
};

export default PriceInput;
