
import { Input } from "@/components/ui/input";
import { IndianRupee } from "lucide-react";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PriceInput = ({ value, onChange }: PriceInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium block flex items-center">
        <IndianRupee className="h-4 w-4 mr-1.5 text-primary" />
        Price *
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
        <Input 
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-8 border-primary/20 focus-visible:ring-primary/30 shadow-sm" 
          placeholder="Enter price"
          required
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Set a competitive price to attract buyers
      </p>
    </div>
  );
};

export default PriceInput;
