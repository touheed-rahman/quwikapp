
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Wrench, Smartphone, Zap, Droplet, Car, Scissors, 
  GraduationCap, Brush, Shirt, Trophy, Home, Utensils, 
  Monitor, LucideIcon
} from "lucide-react";

interface EnhancedServiceCardProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  subservicesCount: number;
  onClick: () => void;
}

// Map of service categories to their respective icons
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  electronic: Zap,
  mobile: Smartphone,
  car: Car,
  salon: Scissors,
  health: Droplet,
  education: GraduationCap,
  cleaning: Brush,
  fashion: Shirt,
  sports: Trophy,
  home_improvement: Wrench,
  food: Utensils,
  tech_services: Monitor,
};

const EnhancedServiceCard = ({ 
  id, 
  name, 
  icon, 
  color, 
  subservicesCount, 
  onClick 
}: EnhancedServiceCardProps) => {
  const IconComponent = iconMap[id] || Home;
  
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card 
        className="h-full overflow-hidden border border-transparent hover:border-primary/30 cursor-pointer transition-all duration-300 hover:shadow-lg group"
        onClick={onClick}
      >
        <div 
          className={`${color} p-6 aspect-video flex items-center justify-center relative overflow-hidden`}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-8 -top-8 w-16 h-16 rounded-full bg-white/30"></div>
            <div className="absolute -left-4 -bottom-4 w-12 h-12 rounded-full bg-white/20"></div>
            <div className="absolute right-1/4 bottom-1/4 w-8 h-8 rounded-full bg-white/20"></div>
          </div>
          
          <IconComponent className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        <CardContent className="p-4 text-center">
          <h3 className="font-medium text-base mb-2">{name}</h3>
          <Separator className="my-2 bg-primary/10" />
          <div className="flex items-center justify-center mt-2">
            <Badge variant="outline" className="bg-primary/5 text-xs px-2 py-0.5">
              {subservicesCount} services
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedServiceCard;
