import { Heart, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ProductCondition } from "@/types/categories";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id?: string | number;
  title: string;
  price: number;
  location: string;
  image: string;
  date?: string;
  featured?: boolean;
  condition?: ProductCondition;
  category?: string;
}

const ProductCard = ({
  id = "1",
  title,
  price,
  location,
  image,
  featured,
  condition,
}: ProductCardProps) => {
  const getConditionColor = (condition?: ProductCondition) => {
    switch (condition) {
      case "new":
        return "bg-green-500 text-white";
      case "excellent":
        return "bg-primary text-white";
      case "good":
        return "bg-yellow-500 text-white";
      case "moderate":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Link to={`/product/${id}`}>
      <Card className="overflow-hidden border-0 bg-transparent">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 h-8 w-8"
          >
            <Heart className="h-4 w-4" />
          </Button>
          {featured && (
            <Badge variant="default" className="absolute top-2 left-2 bg-yellow-500 text-white">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-2">
          <p className="text-lg font-bold text-primary">
            ₹{price.toLocaleString()}
          </p>
          <h3 className="text-sm font-medium line-clamp-2 mb-1 text-foreground/80">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
            {condition && (
              <Badge className={getConditionColor(condition)}>
                {condition}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;