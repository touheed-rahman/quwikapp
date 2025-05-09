
import { motion } from "framer-motion";
import { Tag, Clock, CheckCircle2, ArrowRight, Percent, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const PromoBanner = () => {
  return (
    <motion.div
      className="my-12 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First Promo Banner */}
        <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 rounded-xl overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mt-10 -mr-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -mb-8 -ml-8"></div>
          
          <div className="p-6 md:p-8 relative z-10">
            <div className="flex items-center mb-2">
              <Tag className="h-5 w-5 text-white mr-2" />
              <p className="text-white/90 text-sm font-medium">LIMITED TIME OFFER</p>
            </div>
            
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">
              50% OFF on AC Services
            </h3>
            
            <p className="text-white/80 mb-4">
              Beat the heat with our professional AC repair and service starting at just ₹299
            </p>
            
            <div className="flex items-center text-white/90 text-sm mb-6">
              <Clock className="h-4 w-4 mr-2" />
              <span>Offer ends in 2 days</span>
            </div>
            
            <Button className="bg-white text-purple-600 hover:bg-white/90 group">
              Book Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
        
        {/* Second Promo Banner */}
        <div className="bg-gradient-to-r from-amber-500/90 to-orange-600/90 rounded-xl overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mt-10 -mr-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -mb-8 -ml-8"></div>
          
          <div className="p-6 md:p-8 relative z-10">
            <div className="flex items-center mb-2">
              <Tag className="h-5 w-5 text-white mr-2" />
              <p className="text-white/90 text-sm font-medium">NEW USER SPECIAL</p>
            </div>
            
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">
              ₹100 OFF Your First Booking
            </h3>
            
            <p className="text-white/80 mb-4">
              Try our mobile repair services with expert technicians starting at just ₹299
            </p>
            
            <ul className="mb-6 space-y-2">
              <li className="flex items-center text-white/90 text-sm">
                <CheckCircle2 className="h-4 w-4 mr-2 text-white" />
                <span>All brands supported</span>
              </li>
              <li className="flex items-center text-white/90 text-sm">
                <CheckCircle2 className="h-4 w-4 mr-2 text-white" />
                <span>Genuine parts guaranteed</span>
              </li>
            </ul>
            
            <Button className="bg-white text-orange-600 hover:bg-white/90 group">
              Book Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
        
        {/* Third Promo Banner */}
        <div className="bg-gradient-to-r from-green-600/90 to-emerald-600/90 rounded-xl overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mt-10 -mr-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -mb-8 -ml-8"></div>
          
          <div className="p-6 md:p-8 relative z-10">
            <div className="flex items-center mb-2">
              <Percent className="h-5 w-5 text-white mr-2" />
              <p className="text-white/90 text-sm font-medium">SPECIAL DISCOUNT</p>
            </div>
            
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">
              Home Services at ₹349
            </h3>
            
            <p className="text-white/80 mb-4">
              Professional plumbing, electrical and carpentry services by verified experts
            </p>
            
            <ul className="mb-6 space-y-2">
              <li className="flex items-center text-white/90 text-sm">
                <Shield className="h-4 w-4 mr-2 text-white" />
                <span>30-day service guarantee</span>
              </li>
              <li className="flex items-center text-white/90 text-sm">
                <CheckCircle2 className="h-4 w-4 mr-2 text-white" />
                <span>Fully insured professionals</span>
              </li>
            </ul>
            
            <Button className="bg-white text-green-600 hover:bg-white/90 group">
              Book Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PromoBanner;
