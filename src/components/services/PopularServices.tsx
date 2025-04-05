
import { motion } from "framer-motion";
import { Smartphone, WashingMachine, Zap, PaintBucket, Calendar, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { servicePricing } from "@/types/serviceTypes";

type PopularServicesProps = {
  onSelectService: (id: string, name: string) => void;
};

const PopularServices = ({ onSelectService }: PopularServicesProps) => {
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
      badgeColor: "bg-blue-100 text-blue-800"
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
      badgeColor: "bg-purple-100 text-purple-800"
    },
    {
      id: "electronic-washing_machine",
      name: "Washing Machine Repair",
      price: servicePricing.electronic.washing_machine,
      icon: WashingMachine,
      category: "electronic",
      color: "from-teal-50 to-teal-100",
      iconColor: "text-teal-600"
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
      badgeColor: "bg-amber-100 text-amber-800"
    },
    {
      id: "electronic-ac_service",
      name: "Annual Appliance Service",
      price: servicePricing.electronic.ac_service,
      icon: Calendar,
      category: "electronic",
      color: "from-green-50 to-green-100",
      iconColor: "text-green-600",
      badge: "20% Off",
      badgeColor: "bg-green-100 text-green-800"
    },
    {
      id: "cleaning-home_cleaning",
      name: "Premium Home Cleaning",
      price: servicePricing.cleaning.home_cleaning,
      icon: Sparkles,
      category: "cleaning",
      color: "from-indigo-50 to-indigo-100",
      iconColor: "text-indigo-600"
    }
  ];

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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {services.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ y: -5, scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => onSelectService(service.id, service.name)}
          >
            <Card className="overflow-hidden h-full border-transparent hover:border-primary/20 transition-all duration-300 group">
              <div className={`bg-gradient-to-br ${service.color} p-4 relative`}>
                {service.badge && (
                  <Badge className={`absolute top-1 right-1 text-xs ${service.badgeColor}`}>
                    {service.badge}
                  </Badge>
                )}
                <service.icon className={`h-10 w-10 ${service.iconColor} mx-auto group-hover:scale-110 transition-transform duration-300`} />
              </div>
              <CardContent className="p-3 text-center">
                <h3 className="font-medium text-sm text-slate-900 mb-1 line-clamp-2">{service.name}</h3>
                <p className="text-primary font-semibold text-sm">From ₹{service.price}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PopularServices;
