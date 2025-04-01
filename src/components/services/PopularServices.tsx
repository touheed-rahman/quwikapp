
import { motion } from "framer-motion";
import { Smartphone, WashingMachine, Zap, PaintBucket, Calendar, Sparkles, Award, Clock, Star, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { servicePricing } from "@/types/serviceTypes";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

type PopularServicesProps = {
  onSelectService: (id: string, name: string) => void;
};

const PopularServices = ({ onSelectService }: PopularServicesProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();
  
  const services = [
    {
      id: "electronic-ac_service",
      name: "AC Repair & Service",
      price: servicePricing.electronic.ac_service,
      icon: Zap,
      category: "electronic",
      color: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      badge: "Most Popular",
      badgeColor: "bg-blue-100 text-blue-800",
      rating: 4.9,
      reviews: 238,
      timeEstimate: "1-2 hrs"
    },
    {
      id: "mobile-mobile_repair",
      name: "Mobile Screen Repair",
      price: servicePricing.mobile.screen_replacement,
      icon: Smartphone,
      category: "mobile",
      color: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
      badge: "Fast Service",
      badgeColor: "bg-purple-100 text-purple-800",
      rating: 4.7,
      reviews: 164,
      timeEstimate: "30-60 min"
    },
    {
      id: "electronic-washing_machine",
      name: "Washing Machine Repair",
      price: servicePricing.electronic.washing_machine,
      icon: WashingMachine,
      category: "electronic",
      color: "from-teal-50 to-teal-100",
      iconColor: "text-teal-600",
      rating: 4.8,
      reviews: 196,
      timeEstimate: "1-2 hrs"
    },
    {
      id: "home-painting",
      name: "Home Painting",
      price: servicePricing.home.painting,
      icon: PaintBucket,
      category: "home",
      color: "from-amber-50 to-amber-100",
      iconColor: "text-amber-600",
      badge: "New",
      badgeColor: "bg-amber-100 text-amber-800",
      rating: 4.6,
      reviews: 89,
      timeEstimate: "3-5 hrs"
    }
  ];

  const toggleFavorite = (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation();
    
    setFavorites(prev => {
      if (prev.includes(serviceId)) {
        toast({
          title: "Removed from favorites",
          description: "Service removed from your favorites",
          duration: 1500,
        });
        return prev.filter(id => id !== serviceId);
      } else {
        toast({
          title: "Added to favorites",
          description: "Service added to your favorites",
          duration: 1500,
        });
        return [...prev, serviceId];
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Popular Services</h2>
          <p className="text-muted-foreground">Our most booked services with great ratings</p>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary">Starting at ₹{Math.min(...Object.values(servicePricing.home))}</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ y: -5, scale: 1.02 }}
            className="cursor-pointer h-full"
          >
            <Card className="overflow-hidden h-full border-transparent hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
              <div 
                className={`relative bg-gradient-to-br ${service.color} p-5`}
                onClick={() => onSelectService(service.id, service.name)}
              >
                {service.badge && (
                  <Badge className={`absolute top-2 left-2 text-xs ${service.badgeColor}`}>
                    {service.badge}
                  </Badge>
                )}
                
                <button 
                  className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                  onClick={(e) => toggleFavorite(e, service.id)}
                >
                  <Heart 
                    className={`h-4 w-4 ${favorites.includes(service.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                  />
                </button>
                
                <div className="flex justify-center">
                  <service.icon className={`h-16 w-16 ${service.iconColor} mx-auto group-hover:scale-110 transition-transform duration-300`} />
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3" onClick={() => onSelectService(service.id, service.name)}>
                <h3 className="font-medium text-base text-center text-slate-900">{service.name}</h3>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{service.timeEstimate}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{service.rating}</span>
                    <span className="text-muted-foreground">({service.reviews})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Starting from</div>
                    <div className="text-primary font-bold text-lg">₹{service.price}</div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-primary/20 hover:bg-primary/10 hover:text-primary"
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center pt-4">
        <Button variant="outline" size="lg" className="bg-primary/5 hover:bg-primary/10">
          View All Services <Award className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PopularServices;
