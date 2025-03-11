
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FeatureOption } from "./types";
import FeatureOptionCard from "./FeatureOptionCard";
import { Home, ShoppingBag, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface FeatureOptionsStepProps {
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
  freeRequestsCount?: number | null;
  hasFreeFeatures?: boolean;
  isLoadingPricing?: boolean;
  featurePricing?: Record<string, any>;
}

export default function FeatureOptionsStep({ 
  selectedOption, 
  setSelectedOption,
  freeRequestsCount = null,
  hasFreeFeatures = true,
  isLoadingPricing = false,
  featurePricing = {}
}: FeatureOptionsStepProps) {
  // Feature options with both paid and free options
  const getFeaturePricing = (): FeatureOption[] => {
    // Base options
    const options = [
      {
        id: "homepage",
        title: "Homepage Feature",
        description: "Your listing will be featured on our homepage",
        price: hasFreeFeatures ? 0 : (featurePricing?.homepage?.price || 499),
        originalPrice: featurePricing?.homepage?.original_price || 499,
        icon: <Home className="h-5 w-5 text-secondary" />
      },
      {
        id: "productPage",
        title: "Category Feature",
        description: "Your listing will be featured in its category page",
        price: hasFreeFeatures ? 0 : (featurePricing?.productPage?.price || 299),
        originalPrice: featurePricing?.productPage?.original_price || 299,
        icon: <Tag className="h-5 w-5 text-primary" />
      },
      {
        id: "both",
        title: "Premium Feature",
        description: "Your listing will be featured everywhere!",
        price: hasFreeFeatures ? 0 : (featurePricing?.both?.price || 799),
        originalPrice: featurePricing?.both?.original_price || 799,
        icon: <ShoppingBag className="h-5 w-5 text-accent" />
      }
    ];

    return options;
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
      
      {freeRequestsCount !== null && (
        <div className="my-4 p-3 border rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Free Features Available</span>
            <Badge variant={hasFreeFeatures ? "default" : "outline"} className="ml-2">
              {freeRequestsCount} of 3 used
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {hasFreeFeatures 
              ? `You have used ${freeRequestsCount} of your 3 free feature requests. ${3 - freeRequestsCount} remaining.` 
              : "You've used all your free feature requests. You can still feature your listings at the prices shown below."}
          </p>
        </div>
      )}
      
      <div className="space-y-4 my-4">
        {isLoadingPricing ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          featureOptions.map((option) => (
            <FeatureOptionCard
              key={option.id}
              option={option}
              isSelected={selectedOption === option.id}
              onSelect={setSelectedOption}
            />
          ))
        )}
      </div>
    </>
  );
}
