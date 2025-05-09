
import { motion } from "framer-motion";
import { AlertCircle, Shield, Calendar, CreditCard, Star, Tag, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ServiceGuarantee = () => {
  return (
    <motion.div 
      className="mt-12 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-center md:text-left bg-gradient-to-r from-primary/90 to-primary/70 text-transparent bg-clip-text">
          Our Service Guarantees
        </h2>
        <Badge variant="outline" className="bg-primary/10 px-4 py-1.5">
          <Award className="h-4 w-4 mr-2 text-primary" />
          <span>Trusted by 1M+ customers</span>
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 hover:shadow-lg transition-shadow group overflow-hidden">
          <div className="absolute top-0 right-0">
            <div className="w-20 h-20 bg-primary/20 rotate-45 transform origin-bottom-left"></div>
          </div>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full p-4 mb-4 group-hover:bg-primary/20 transition-colors">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Verified Professionals</h3>
            <p className="text-muted-foreground">All our service professionals are verified and background-checked for your safety</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 hover:shadow-lg transition-shadow group overflow-hidden">
          <div className="absolute top-0 right-0">
            <div className="w-20 h-20 bg-primary/20 rotate-45 transform origin-bottom-left"></div>
          </div>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full p-4 mb-4 group-hover:bg-primary/20 transition-colors">
              <Calendar className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">30-Day Warranty</h3>
            <p className="text-muted-foreground">All services come with a 30-day warranty for your complete peace of mind</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 hover:shadow-lg transition-shadow group overflow-hidden">
          <div className="absolute top-0 right-0">
            <div className="w-20 h-20 bg-primary/20 rotate-45 transform origin-bottom-left"></div>
          </div>
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
          <div className="bg-primary/20 rounded-full p-4 shrink-0">
            <AlertCircle className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">100% Satisfaction Guarantee</h3>
            <p className="text-muted-foreground">If you're not completely satisfied with our service, we'll make it right or give you a full refund.</p>
            <div className="flex items-center mt-3 space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-primary text-primary" />
              ))}
              <span className="text-sm ml-2 font-medium">4.8/5 based on 10,000+ reviews</span>
            </div>
          </div>
          <Button size="lg" className="shrink-0 mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white group">
            Learn More
            <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceGuarantee;
