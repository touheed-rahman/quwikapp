
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FeatureOption } from "./types";
import FeatureOptionCard from "./FeatureOptionCard";
import { Home, ShoppingBag, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
          {freeRequestsCount !== null && (
            <div className="mt-2 text-sm">
              You have used {freeRequestsCount}/3 free feature requests
              {!hasFreeFeatures && (
                <span className="font-medium text-primary"> - Pricing shown below</span>
              )}
            </div>
          )}
        </DialogDescription>
      </DialogHeader>
      
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
