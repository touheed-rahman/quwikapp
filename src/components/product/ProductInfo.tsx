
import { Heart, Share2, MapPin, Calendar, Clock, CalendarRange } from "lucide-react";
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
  year?: number | null;
}

const ProductInfo = ({
  title,
  price,
  location,
  createdAt,
  condition,
  description,
  category,
  km_driven,
  year
}: ProductInfoProps) => {
  // Extract just the area name
  const displayLocation = location?.split(/[|,]/)[0].trim() || 'Location not specified';
  const isVehicle = category === 'vehicles';

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
        {isVehicle && km_driven !== null && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{km_driven.toLocaleString()} km driven</span>
          </div>
        )}
        {isVehicle && year !== null && (
          <div className="flex items-center gap-1">
            <CalendarRange className="h-4 w-4" />
            <span>Year {year}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {!isVehicle && (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {condition}
          </Badge>
        )}
        {isVehicle && km_driven !== null && (
          <Badge variant="outline">
            {km_driven.toLocaleString()} km
          </Badge>
        )}
        {isVehicle && year !== null && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            Year {year}
          </Badge>
        )}
      </div>

      <Card className="overflow-hidden">
        <ScrollArea className="h-[200px] w-full p-4">
          <div className="space-y-4">
            <h2 className="font-semibold">Description</h2>
            <p className="text-black whitespace-pre-wrap">{description}</p>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ProductInfo;
