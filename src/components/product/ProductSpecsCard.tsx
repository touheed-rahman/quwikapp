
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import VehicleSpecsDetails from "./specs/VehicleSpecsDetails";
import GeneralSpecsDetails from "./specs/GeneralSpecsDetails";
import { Sparkles } from "lucide-react";

interface ProductSpecsCardProps {
  brand?: string | null;
  specs?: Record<string, any> | null;
  km_driven?: number | null;
  category?: string;
  condition: string;
}

const ProductSpecsCard = ({ 
  brand, 
  specs, 
  km_driven, 
  category,
  condition 
}: ProductSpecsCardProps) => {
  // Determine if we have any specs to show - modified to better check specs
  const specsHasValues = specs && Object.entries(specs).some(([_, value]) => 
    value !== null && value !== undefined && value !== ''
  );
  
  const hasSpecs = brand || specsHasValues || km_driven !== null;

  // Simplified check to display appropriate component
  const shouldDisplayVehicleSpecs = category === 'vehicles';
  const shouldDisplayGeneralSpecs = !shouldDisplayVehicleSpecs && (specsHasValues || brand);

  return (
    <Card className="p-3 md:p-4 max-w-full overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-200">
      <div className="space-y-2 md:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm md:text-base flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            Item Details
          </h2>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {condition}
          </Badge>
        </div>
        
        {shouldDisplayVehicleSpecs ? (
          <VehicleSpecsDetails 
            brand={brand} 
            specs={specs} 
            km_driven={km_driven} 
          />
        ) : shouldDisplayGeneralSpecs ? (
          <GeneralSpecsDetails 
            brand={brand} 
            specs={specs} 
            category={category} 
          />
        ) : (
          <div className="py-2 text-sm text-muted-foreground">
            {brand ? (
              <p className="mt-1">Brand: {brand}</p>
            ) : (
              <p>No additional details available</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductSpecsCard;
