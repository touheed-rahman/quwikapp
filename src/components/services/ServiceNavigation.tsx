
import { Link } from "react-router-dom";
import { Home, CalendarCheck, UserCircle2, Menu, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ServiceNavigation = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { toast } = useToast();

  const handleNotImplemented = () => {
    toast({
      title: "Coming Soon!",
      description: "This feature will be available in the next update.",
      variant: "default",
    });
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-between px-6 py-2 z-50 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link 
        to="/" 
        className="flex flex-col items-center gap-1"
        onClick={() => setActiveTab("home")}
      >
        <Home className={`h-6 w-6 ${activeTab === "home" ? "text-primary" : "text-muted-foreground"}`} />
        <span className={`text-xs ${activeTab === "home" ? "text-primary" : "text-muted-foreground"}`}>Home</span>
      </Link>
      
      <button 
        onClick={() => {
          setActiveTab("services");
          handleNotImplemented();
        }}
        className="flex flex-col items-center gap-1"
      >
        <Wrench className={`h-6 w-6 ${activeTab === "services" ? "text-primary" : "text-muted-foreground"}`} />
        <span className={`text-xs ${activeTab === "services" ? "text-primary" : "text-muted-foreground"}`}>Services</span>
      </button>
      
      <button 
        onClick={() => {
          setActiveTab("bookings");
          handleNotImplemented();
        }}
        className="flex flex-col items-center gap-1"
      >
        <CalendarCheck className={`h-6 w-6 ${activeTab === "bookings" ? "text-primary" : "text-muted-foreground"}`} />
        <span className={`text-xs ${activeTab === "bookings" ? "text-primary" : "text-muted-foreground"}`}>My Bookings</span>
        <Badge className="absolute -top-1 right-1 h-4 w-4 flex items-center justify-center bg-primary text-[10px]">
          2
        </Badge>
      </button>
      
      <Link 
        to="/profile" 
        className="flex flex-col items-center gap-1"
        onClick={() => setActiveTab("profile")}
      >
        <UserCircle2 className={`h-6 w-6 ${activeTab === "profile" ? "text-primary" : "text-muted-foreground"}`} />
        <span className={`text-xs ${activeTab === "profile" ? "text-primary" : "text-muted-foreground"}`}>Profile</span>
      </Link>
      
      <Sheet>
        <SheetTrigger asChild>
          <button className="flex flex-col items-center gap-1">
            <Menu className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">More</span>
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[260px] sm:w-[400px]">
          <div className="flex flex-col gap-4 py-4">
            <h3 className="text-lg font-semibold mb-2">Service Menu</h3>
            <Button variant="outline" className="justify-start" onClick={handleNotImplemented}>
              <CalendarCheck className="mr-2 h-4 w-4" />
              My Bookings
            </Button>
            <Button variant="outline" className="justify-start" onClick={handleNotImplemented}>
              <UserCircle2 className="mr-2 h-4 w-4" />
              My Profile
            </Button>
            <Button variant="outline" className="justify-start" onClick={handleNotImplemented}>
              <Wrench className="mr-2 h-4 w-4" />
              Become a Service Provider
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default ServiceNavigation;
