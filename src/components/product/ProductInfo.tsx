
import { Heart, Share2, MapPin, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductCondition } from "@/types/categories";

interface ProductInfoProps {
  title: string;
  price: number;
  location: string;
  createdAt: string;
  condition: ProductCondition;
  description: string;
  category?: string;
  km_driven?: number | null;
}

const ProductInfo = ({
  title,
  price,
  location,
  createdAt,
  condition,
  description,
  category,
  km_driven
}: ProductInfoProps) => {
  // Extract just the area name
  const displayLocation = location?.split(/[|,]/)[0].trim() || 'Location not specified';

  return (
    <div className="space-y-3 md:space-y-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4">
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-lg md:text-3xl font-bold break-words">{title}</h1>
          <p className="text-xl md:text-4xl font-bold text-primary">
            ₹{price.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2 self-end md:self-start">
          <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full">
            <Share2 className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full">
            <Heart className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 md:h-4 md:w-4" />
          <span>{displayLocation}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        {category === 'vehicles' && km_driven !== null && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 md:h-4 md:w-4" />
            <span>{km_driven.toLocaleString()} km driven</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
          {condition}
        </Badge>
        {category === 'vehicles' && km_driven !== null && (
          <Badge variant="outline">
            {km_driven.toLocaleString()} km
          </Badge>
        )}
      </div>

      <Card className="p-3 md:p-4 max-w-full">
        <div className="space-y-2 md:space-y-4">
          <h2 className="font-semibold text-sm md:text-base">Description</h2>
          <p className="text-black whitespace-pre-wrap text-xs md:text-sm break-words max-w-full overflow-x-hidden">{description}</p>
        </div>
      </Card>
    </div>
  );
};

export default ProductInfo;
