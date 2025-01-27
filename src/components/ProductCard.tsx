import { Heart, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "./ui/card";

interface ProductCardProps {
  title: string;
  price: number;
  location: string;
  image: string;
}

const ProductCard = ({ title, price, location, image }: ProductCardProps) => {
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
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{title}</h3>
        <p className="text-2xl font-bold text-primary">${price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;