
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
  // Determine if we have any specs to show
  const hasSpecs = brand || 
    (specs && Object.keys(specs).some(key => specs[key] !== null)) || 
    km_driven !== null;

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
        
        {hasSpecs ? (
          category === 'vehicles' ? (
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
          )
        ) : (
          <div className="py-2 text-sm text-muted-foreground">
            <p>Basic item in {category || 'good'} condition</p>
            {brand && <p className="mt-1">Brand: {brand}</p>}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductSpecsCard;
