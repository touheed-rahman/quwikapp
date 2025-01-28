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
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "excellent":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "good":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "moderate":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  return (
    <Link to={`/product/${id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-up border-0 bg-transparent">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
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