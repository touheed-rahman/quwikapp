
import { Heart, Share2, MapPin, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductCondition } from "@/types/categories";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-xl md:text-3xl font-bold break-words">{title}</h1>
          <p className="text-2xl md:text-4xl font-bold text-primary">
            ₹{price.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2 self-end md:self-start">
          <Button variant="outline" size="icon" className="rounded-full">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{displayLocation}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        {category === 'vehicles' && km_driven !== null && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
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

      <Card className="overflow-hidden">
        <ScrollArea className="h-[200px] w-full p-4">
          <div className="space-y-4">
            <h2 className="font-semibold">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ProductInfo;
