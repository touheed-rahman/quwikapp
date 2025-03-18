
import { motion } from "framer-motion";
import { AlertCircle, Shield, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ServiceGuarantee = () => {
  return (
    <motion.div 
      className="mt-12 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-primary/90 to-primary/70 text-transparent bg-clip-text mb-6">
        Our Service Guarantees
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 hover:shadow-lg transition-shadow group">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full p-4 mb-4 group-hover:bg-primary/20 transition-colors">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Verified Professionals</h3>
            <p className="text-muted-foreground">All our service professionals are verified and background-checked for your safety</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 hover:shadow-lg transition-shadow group">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full p-4 mb-4 group-hover:bg-primary/20 transition-colors">
              <Calendar className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">30-Day Warranty</h3>
            <p className="text-muted-foreground">All services come with a 30-day warranty for your complete peace of mind</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 hover:shadow-lg transition-shadow group">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full p-4 mb-4 group-hover:bg-primary/20 transition-colors">
              <CreditCard className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Pay After Service</h3>
            <p className="text-muted-foreground">You only pay after the service is completed to your satisfaction</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10 overflow-hidden mt-6">
        <CardContent className="flex flex-col md:flex-row items-center p-6 gap-6">
          <div className="bg-primary/20 rounded-full p-4">
            <AlertCircle className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">100% Satisfaction Guarantee</h3>
            <p className="text-muted-foreground">If you're not completely satisfied with our service, we'll make it right or give you a full refund.</p>
          </div>
          <Button size="lg" className="shrink-0 mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white">
            Learn More
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceGuarantee;
