
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConditionSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const ConditionSelect = ({ value, onChange }: ConditionSelectProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">
        Condition *
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="excellent">Excellent</SelectItem>
          <SelectItem value="good">Good</SelectItem>
          <SelectItem value="moderate">Moderate</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ConditionSelect;
