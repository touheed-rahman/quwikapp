
import { motion } from "framer-motion";
import { Tag, Clock, CheckCircle2, ArrowRight, Percent, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromoBannerProps {
  onDirectBooking: (categoryId: string, serviceId?: string | null) => void;
}

const PromoBanner = ({ onDirectBooking }: PromoBannerProps) => {
  const bannerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6">Special Offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AC Services Promo Banner */}
        <motion.div 
          className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 rounded-xl overflow-hidden relative shadow-lg"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
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
            
            <Button 
              onClick={() => onDirectBooking("electronic", "ac_service")}
              className="bg-white text-purple-600 hover:bg-white/90 group w-full"
            >
              Book Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
        
        {/* Mobile Repair Banner */}
        <motion.div 
          className="bg-gradient-to-r from-amber-500/90 to-orange-600/90 rounded-xl overflow-hidden relative shadow-lg"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
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
            
            <Button 
              onClick={() => onDirectBooking("mobile", "screen_replacement")}
              className="bg-white text-orange-600 hover:bg-white/90 group w-full"
            >
              Book Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
        
        {/* Home Services Banner */}
        <motion.div 
          className="bg-gradient-to-r from-green-600/90 to-emerald-600/90 rounded-xl overflow-hidden relative shadow-lg"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
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
            
            <Button 
              onClick={() => onDirectBooking("home", "plumbing")}
              className="bg-white text-green-600 hover:bg-white/90 group w-full"
            >
              Book Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* New banner row with larger promo */}
      <motion.div 
        className="mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl overflow-hidden shadow-lg"
        variants={bannerVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12 relative z-10">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-white mr-2" />
              <p className="text-white/90 text-sm font-medium">WEEKEND SPECIAL</p>
            </div>
            
            <h3 className="text-white text-3xl md:text-4xl font-bold mb-4">
              Book Any Service <br />Get 20% OFF
            </h3>
            
            <p className="text-white/80 mb-6 text-lg">
              Limited time offer for this weekend only. Book any service and get an instant discount!
            </p>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => onDirectBooking("electronic")}
                size="lg"
                className="bg-white text-indigo-600 hover:bg-white/90 group"
              >
                Electronics <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                onClick={() => onDirectBooking("home")}
                size="lg"
                className="bg-transparent text-white border border-white hover:bg-white/10 group"
              >
                Home Services <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')", opacity: 0.3}} />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-transparent" />
            <div className="absolute bottom-12 right-12 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <div className="text-sm font-medium text-indigo-600">Offer valid till</div>
              <div className="text-2xl font-bold">Sunday, 11:59 PM</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PromoBanner;
