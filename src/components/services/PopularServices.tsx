
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Define popular services data structure
const popularServices = [
  {
    id: "electronic-television",
    name: "TV Repair & Installation",
    price: 399,
    rating: 4.9,
    reviews: 124,
    image: "/placeholder.svg",
    tags: ["Smart TV", "LED", "LCD", "Setup"]
  },
  {
    id: "appliance-washing_machine",
    name: "Washing Machine Repair",
    price: 349,
    rating: 4.8,
    reviews: 98,
    image: "/placeholder.svg",
    tags: ["Front Load", "Top Load", "Installation"]
  },
  {
    id: "plumbing-water_heater",
    name: "Water Heater Service",
    price: 549,
    rating: 4.7,
    reviews: 85,
    image: "/placeholder.svg",
    tags: ["Repair", "Installation", "Maintenance"]
  },
  {
    id: "appliance-air_conditioner",
    name: "AC Repair & Service",
    price: 649,
    rating: 4.8,
    reviews: 112,
    image: "/placeholder.svg",
    tags: ["Split AC", "Window AC", "Service"]
  }
];

interface PopularServicesProps {
  onSelectService: (id: string, name: string) => void;
}

const PopularServices = ({ onSelectService }: PopularServicesProps) => {
  const navigate = useNavigate();

  return (
    <section className="mt-8 mb-12">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold mb-1">Popular Services</h2>
          <p className="text-muted-foreground text-sm">Most requested services near you</p>
        </div>
        <Button 
          variant="link" 
          className="flex items-center gap-1 text-primary"
          onClick={() => navigate("/service-center")}
        >
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {popularServices.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full overflow-hidden border border-primary/10 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelectService(service.id, service.name)}>
              <div className="aspect-[4/3] bg-muted-foreground/10 relative">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary/90 hover:bg-primary">₹{service.price}</Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold mb-1 line-clamp-1">{service.name}</h3>
                <div className="flex items-center gap-1 text-xs mb-2">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{service.rating}</span>
                  <span className="text-muted-foreground">({service.reviews} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {service.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-primary/5 text-primary-foreground/80 border-primary/10 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PopularServices;
