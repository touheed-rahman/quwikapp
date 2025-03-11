
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FeatureOption } from "./types";
import FeatureOptionCard from "./FeatureOptionCard";
import { Home, ShoppingBag, Tag } from "lucide-react";

interface FeatureOptionsStepProps {
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
}

export default function FeatureOptionsStep({ 
  selectedOption, 
  setSelectedOption 
}: FeatureOptionsStepProps) {
  // Feature options with both paid and free options
  const getFeaturePricing = (): FeatureOption[] => {
    return [
      {
        id: "homepage",
        title: "Homepage Feature",
        description: "Your listing will be featured on our homepage",
        price: 0,
        originalPrice: 499,
        icon: <Home className="h-5 w-5 text-secondary" />
      },
      {
        id: "productPage",
        title: "Category Feature",
        description: "Your listing will be featured in its category page",
        price: 0,
        originalPrice: 299,
        icon: <Tag className="h-5 w-5 text-primary" />
      },
      {
        id: "both",
        title: "Premium Feature",
        description: "Your listing will be featured everywhere!",
        price: 0,
        originalPrice: 799,
        icon: <ShoppingBag className="h-5 w-5 text-accent" />
      }
    ];
  };

  const featureOptions = getFeaturePricing();
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Feature Your Listing</DialogTitle>
        <DialogDescription>
          Make your listing stand out by featuring it on our platform
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 my-4">
        {featureOptions.map((option) => (
          <FeatureOptionCard
            key={option.id}
            option={option}
            isSelected={selectedOption === option.id}
            onSelect={setSelectedOption}
          />
        ))}
      </div>
    </>
  );
}
