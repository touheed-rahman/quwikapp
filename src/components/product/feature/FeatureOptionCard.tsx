
import { FeatureOption } from "./types";
import { Home, ShoppingBag, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureOptionCardProps {
  option: FeatureOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function FeatureOptionCard({
  option,
  isSelected,
  onSelect,
}: FeatureOptionCardProps) {
  const renderIcon = () => {
    switch (option.iconType) {
      case 'home':
        return <Home className="h-5 w-5 text-secondary" />;
      case 'tag':
        return <Tag className="h-5 w-5 text-primary" />;
      case 'shopping-bag':
        return <ShoppingBag className="h-5 w-5 text-accent" />;
    }
  };

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg border cursor-pointer transition-all",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      )}
      onClick={() => onSelect(option.id)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {renderIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{option.title}</h3>
          <p className="text-sm text-muted-foreground">{option.description}</p>
          <div className="mt-2">
            {option.price === 0 ? (
              <span className="text-green-600 font-semibold">Free</span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-semibold">₹{option.price}</span>
                {option.originalPrice > option.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{option.originalPrice}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
