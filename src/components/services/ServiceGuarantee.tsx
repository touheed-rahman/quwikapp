
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
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
        <CardContent className="flex flex-col md:flex-row items-center p-6 gap-6">
          <div className="bg-primary/20 rounded-full p-4">
            <AlertCircle className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Service Guarantee</h3>
            <p className="text-muted-foreground">All our service professionals are verified and provide a 30-day service warranty. You pay only after the service is completed to your satisfaction.</p>
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
