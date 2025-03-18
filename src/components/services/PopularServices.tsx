
import { motion } from "framer-motion";
import { 
  Smartphone, 
  WashingMachine, 
  Wrench, 
  Tv, 
  Zap, 
  RotateCcw, 
  IndianRupee, 
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PopularServices = () => {
  const services = [
    {
      id: 1,
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: "Mobile Repair",
      description: "Screen replacement, battery changes & more",
      price: "299",
      badge: "Most Popular",
      color: "from-blue-500/10 to-blue-500/30"
    },
    {
      id: 2,
      icon: <WashingMachine className="h-10 w-10 text-primary" />,
      title: "Appliance Service",
      description: "AC, refrigerator, washing machine repairs",
      price: "399",
      badge: "Best Value",
      color: "from-amber-500/10 to-amber-500/30"
    },
    {
      id: 3,
      icon: <Wrench className="h-10 w-10 text-primary" />,
      title: "Home Services",
      description: "Plumbing, electrical & carpentry work",
      price: "349",
      badge: "Quick Service",
      color: "from-green-500/10 to-green-500/30"
    },
    {
      id: 4,
      icon: <Tv className="h-10 w-10 text-primary" />,
      title: "TV Repair",
      description: "All brands, all problems fixed at home",
      price: "449",
      badge: "Same Day",
      color: "from-purple-500/10 to-purple-500/30"
    }
  ];

  return (
    <motion.div
      className="my-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 text-transparent bg-clip-text">
            Popular Services
          </h2>
          <p className="text-muted-foreground mt-2">
            Most requested services by our customers
          </p>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0 border-primary/20 text-primary">
          View All Services <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <Card 
            key={service.id}
            className="hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden border border-primary/10"
          >
            <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
            <CardContent className="p-6 relative">
              <Badge className="absolute top-2 right-2 bg-primary/10 text-primary hover:bg-primary/20">
                {service.badge}
              </Badge>
              
              <div className="mb-4 mt-4 flex items-center">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  {service.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">{service.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <IndianRupee className="h-4 w-4 text-primary mr-1" />
                  <span className="font-bold text-lg">{service.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">onwards</span>
                </div>
                <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full w-8 h-8 p-0">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default PopularServices;
