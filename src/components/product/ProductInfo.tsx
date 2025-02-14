
import { Heart, Share2, MapPin, Calendar } from "lucide-react";
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
}

const ProductInfo = ({
  title,
  price,
  location,
  createdAt,
  condition,
  description
}: ProductInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-3xl font-bold text-primary mt-2">
            ₹{price.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>Posted on {new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
        {condition}
      </Badge>

      <Card className="p-4">
        <h2 className="font-semibold mb-2">Description</h2>
        <p className="text-muted-foreground">{description}</p>
      </Card>
    </div>
  );
};

export default ProductInfo;
