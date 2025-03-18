
import { motion } from "framer-motion";
import { ShieldCheck, Clock, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ServiceGuarantee = () => {
  return (
    <motion.div 
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="p-6 flex flex-col md:flex-row items-center gap-4 border-b md:border-b-0 md:border-r border-primary/10">
              <div className="bg-primary/10 rounded-full p-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-sm font-semibold mb-1">Verified Professionals</h3>
                <p className="text-xs text-muted-foreground">Background checked and skill-verified experts</p>
              </div>
            </div>
            
            <div className="p-6 flex flex-col md:flex-row items-center gap-4 border-b md:border-b-0 md:border-r border-primary/10">
              <div className="bg-primary/10 rounded-full p-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-sm font-semibold mb-1">30-Day Warranty</h3>
                <p className="text-xs text-muted-foreground">All services include a 30-day service guarantee</p>
              </div>
            </div>
            
            <div className="p-6 flex flex-col md:flex-row items-center gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-sm font-semibold mb-1">Post-Service Payment</h3>
                <p className="text-xs text-muted-foreground">Pay only after the service meets your satisfaction</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-primary/5 flex justify-center border-t border-primary/10">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white px-6">
              Learn About Our Quality Promise
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceGuarantee;
