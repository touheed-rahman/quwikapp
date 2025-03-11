
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import VehicleSpecsDetails from "./specs/VehicleSpecsDetails";
import GeneralSpecsDetails from "./specs/GeneralSpecsDetails";

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
  // Check if we have specifications to show - more inclusive check for different product types
  const hasSpecs = (specs && Object.keys(specs).length > 0) || 
                   brand !== null || 
                   (category === 'vehicles' && km_driven !== null && km_driven !== undefined);

  // Always show the card, even with minimal info for consistency across all listings
  return (
    <Card className="p-3 md:p-4 max-w-full">
      <div className="space-y-2 md:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm md:text-base">Item Details</h2>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {condition}
          </Badge>
        </div>
        
        {category === 'vehicles' ? (
          <VehicleSpecsDetails 
            brand={brand} 
            specs={specs} 
            km_driven={km_driven} 
          />
        ) : (
          <GeneralSpecsDetails 
            brand={brand} 
            specs={specs} 
            category={category} 
          />
        )}
      </div>
    </Card>
  );
};

export default ProductSpecsCard;
