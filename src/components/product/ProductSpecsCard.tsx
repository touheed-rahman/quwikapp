
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
  // Always show the card for all product types, even with minimal details
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
