
import { motion } from "framer-motion";
import { Shield, Clock, Tag, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "All service providers are vetted professionals with proven track records"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Emergency services available around the clock when you need them most"
  },
  {
    icon: Tag,
    title: "Transparent Pricing",
    description: "No hidden fees or charges, know exactly what you're paying for"
  },
  {
    icon: Award,
    title: "Satisfaction Assured",
    description: "100% satisfaction guarantee or we'll make it right"
  }
];

const ServiceFeatures = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="my-8"
    >
      <h2 className="text-xl font-bold mb-6 text-center">Why Choose Our Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
          >
            <Card className="border border-primary/10 hover:border-primary/20 transition-all h-full">
              <CardContent className="flex flex-col items-center text-center p-5">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ServiceFeatures;
