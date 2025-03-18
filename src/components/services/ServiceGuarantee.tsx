
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Shield, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const ServiceGuarantee = () => {
  const { toast } = useToast();

  const handleLearnMore = () => {
    toast({
      title: "Service Guarantee",
      description: "We guarantee 100% satisfaction with all our services. If you're not happy, we'll make it right.",
      variant: "default",
    });
  };
  
  return (
    <motion.div 
      className="mt-12 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-6 text-center">Why Choose Our Services?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 overflow-hidden">
          <CardContent className="flex flex-col md:flex-row items-center p-6 gap-6">
            <div className="bg-primary/20 rounded-full p-4">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Service Guarantee</h3>
              <p className="text-muted-foreground">All our service professionals are verified and provide a 30-day service warranty. You pay only after the service is completed to your satisfaction.</p>
            </div>
            <Button size="sm" className="shrink-0 mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white" onClick={handleLearnMore}>
              Learn More
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-amber-500/5 to-amber-500/10 border border-amber-500/10 overflow-hidden">
          <CardContent className="flex flex-col md:flex-row items-center p-6 gap-6">
            <div className="bg-amber-500/20 rounded-full p-4">
              <Star className="h-10 w-10 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-muted-foreground">We carefully select our service providers. All professionals are skilled, experienced, and committed to providing exceptional service.</p>
            </div>
            <Button size="sm" className="shrink-0 mt-4 md:mt-0 bg-amber-500 hover:bg-amber-500/90 text-white" onClick={handleLearnMore}>
              Our Standards
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <Card className="border border-primary/10 overflow-hidden bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
            <div className="bg-green-500/10 rounded-full p-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <h4 className="font-medium">Verified Professionals</h4>
            <p className="text-xs text-muted-foreground mt-1">Background checked and verified</p>
          </CardContent>
        </Card>
        
        <Card className="border border-primary/10 overflow-hidden bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
            <div className="bg-blue-500/10 rounded-full p-3 mb-3">
              <AlertCircle className="h-6 w-6 text-blue-500" />
            </div>
            <h4 className="font-medium">Insured Services</h4>
            <p className="text-xs text-muted-foreground mt-1">All services fully insured</p>
          </CardContent>
        </Card>
        
        <Card className="border border-primary/10 overflow-hidden bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
            <div className="bg-purple-500/10 rounded-full p-3 mb-3">
              <Clock className="h-6 w-6 text-purple-500" />
            </div>
            <h4 className="font-medium">Timely Service</h4>
            <p className="text-xs text-muted-foreground mt-1">Punctual and efficient</p>
          </CardContent>
        </Card>
        
        <Card className="border border-primary/10 overflow-hidden bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
            <div className="bg-orange-500/10 rounded-full p-3 mb-3">
              <Star className="h-6 w-6 text-orange-500" />
            </div>
            <h4 className="font-medium">Satisfaction Guarantee</h4>
            <p className="text-xs text-muted-foreground mt-1">100% satisfaction or money back</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ServiceGuarantee;
