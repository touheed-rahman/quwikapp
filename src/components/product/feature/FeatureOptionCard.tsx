
import { Card } from "@/components/ui/card";
import { FeatureOption } from "./types";

interface FeatureOptionCardProps {
  option: FeatureOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function FeatureOptionCard({ option, isSelected, onSelect }: FeatureOptionCardProps) {
  return (
    <Card 
      key={option.id}
      className={`p-4 cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary ring-2 ring-primary/30' 
          : 'hover:border-primary/30'
      }`}
      onClick={() => onSelect(option.id)}
    >
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          {option.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{option.title}</h3>
          <p className="text-sm text-muted-foreground">{option.description}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">Free!</div>
          <div className="text-sm text-muted-foreground line-through">₹{option.originalPrice}</div>
        </div>
      </div>
    </Card>
  );
}
