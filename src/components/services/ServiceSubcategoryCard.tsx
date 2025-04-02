
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceSubcategoryCardProps {
  id: string;
  name: string;
  tags?: string[];
  price: number;
  onBookService: (id: string) => void;
}

const ServiceSubcategoryCard = ({
  id,
  name,
  tags,
  price,
  onBookService
}: ServiceSubcategoryCardProps) => {
  return (
    <Card 
      className="overflow-hidden border-transparent hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <div className="relative h-24 sm:h-32 bg-gradient-to-br from-primary/5 to-primary/10 p-4">
        <div className="absolute bottom-4 left-4">
          <h3 className="text-base sm:text-lg font-semibold">{name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs sm:text-sm font-medium">{(4 + Math.random()).toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({Math.floor(Math.random() * 200) + 50} ratings)</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-3 sm:p-4 space-y-3">                
        <div className="flex justify-between items-center">
          <div className="text-primary font-semibold text-base sm:text-lg">₹{price}</div>
          
          <Button 
            onClick={() => onBookService(id)}
            size="sm"
            className="text-xs sm:text-sm px-3 sm:px-4 py-1 h-8"
          >
            Book Now
          </Button>
        </div>

        {tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 2).map((tag: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs bg-primary/5 text-primary/80">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceSubcategoryCard;
