import { Heart, MapPin, Clock } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "./ui/card";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  title: string;
  price: number;
  location: string;
  image: string;
  date?: string;
  featured?: boolean;
}

const ProductCard = ({ title, price, location, image, date, featured }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-up">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <Heart className="h-5 w-5" />
          </Button>
          {featured && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground" variant="default">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-base sm:text-lg line-clamp-2 mb-2">{title}</h3>
        <p className="text-xl sm:text-2xl font-bold text-primary">${price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{location}</span>
          </div>
          {date && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{date}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;