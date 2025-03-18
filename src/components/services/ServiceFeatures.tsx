
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Zap, HeartHandshake, BadgePercent, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const ServiceFeatures = () => {
  const { toast } = useToast();
  
  const handleFeatureClick = () => {
    toast({
      title: "Special Offer!",
      description: "Use code FIRST10 to get 10% off your first service booking!",
      variant: "default",
    });
  };

  return (
    <motion.div 
      className="my-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Why Our Customers Love Us</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Discover the benefits that make our service the preferred choice for thousands of customers</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="h-full bg-gradient-to-b from-green-50 to-white border-green-100 overflow-hidden">
            <CardContent className="p-6">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Response</h3>
              <p className="text-muted-foreground mb-4">Get quick service with our rapid response team. Most services can be scheduled within 24 hours.</p>
              <div className="flex items-center text-green-600 text-sm font-medium cursor-pointer" onClick={handleFeatureClick}>
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="h-full bg-gradient-to-b from-blue-50 to-white border-blue-100 overflow-hidden">
            <CardContent className="p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-muted-foreground mb-4">All our professionals are vetted, trained, and held to the highest standards of quality.</p>
              <div className="flex items-center text-blue-600 text-sm font-medium cursor-pointer" onClick={handleFeatureClick}>
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="h-full bg-gradient-to-b from-purple-50 to-white border-purple-100 overflow-hidden">
            <CardContent className="p-6">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BadgePercent className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Pricing</h3>
              <p className="text-muted-foreground mb-4">Competitive and transparent pricing with no hidden costs. We offer the best value for your money.</p>
              <div className="flex items-center text-purple-600 text-sm font-medium cursor-pointer" onClick={handleFeatureClick}>
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-primary/20 border border-primary/10 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/20 w-10 h-10 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Convenient Booking</h3>
              </div>
              <p className="text-muted-foreground mb-4">Book services at your convenience, 24/7. Choose the time slot that works best for you.</p>
              <Button variant="outline" className="border-primary/20 hover:bg-primary/10" onClick={handleFeatureClick}>
                Schedule Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Card className="bg-gradient-to-r from-amber-500/5 to-amber-500/20 border border-amber-500/10 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-500/20 w-10 h-10 rounded-full flex items-center justify-center">
                  <PackageOpen className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold">Service Packages</h3>
              </div>
              <p className="text-muted-foreground mb-4">Save with our bundled service packages. Perfect for regular maintenance needs.</p>
              <Button variant="outline" className="border-amber-500/20 hover:bg-amber-500/10" onClick={handleFeatureClick}>
                View Packages
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/10"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center">
              <HeartHandshake className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Become a Service Partner</h3>
              <p className="text-muted-foreground">Join our network of trusted professionals</p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleFeatureClick}>
            Apply Now
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ServiceFeatures;
