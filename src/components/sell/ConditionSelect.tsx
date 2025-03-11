
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeCheck } from "lucide-react";

interface ConditionSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const ConditionSelect = ({ value, onChange }: ConditionSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium block flex items-center">
        <BadgeCheck className="h-4 w-4 mr-1.5 text-primary" />
        Condition *
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-primary/20 focus-visible:ring-primary/30 shadow-sm">
          <SelectValue placeholder="Select condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="excellent">Excellent</SelectItem>
          <SelectItem value="good">Good</SelectItem>
          <SelectItem value="moderate">Moderate</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Be honest about the condition of your item
      </p>
    </div>
  );
};

export default ConditionSelect;
