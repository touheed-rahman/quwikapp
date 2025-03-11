
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FloatingSellButton = () => {
  return (
    <Link
      to="/sell"
      className="hidden md:block fixed bottom-6 right-6 z-50"
    >
      <Button 
        size="lg" 
        className="shadow-lg rounded-full px-8 gap-2 bg-accent hover:bg-accent/90 animate-pulse-glow"
      >
        <Plus className="h-5 w-5" />
        Sell Now
      </Button>
    </Link>
  );
};

export default FloatingSellButton;
