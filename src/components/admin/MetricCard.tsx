
import { ArrowUpRight, TrendingUp, ExternalLink, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  hoverBgColor: string;
  onClick: () => void;
  index: number;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor, 
  hoverBgColor, 
  onClick, 
  index,
  showBackButton = false,
  onBackClick
}: MetricCardProps) => {
  // Calculate a random but consistent trend percentage for demo purposes
  const trendPercentage = Math.floor(((index + 1) * 7) % 30);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card 
        className={`p-6 ${bgColor} border border-${color.replace('text-', '')}/10 cursor-pointer transition-all duration-300 ${hoverBgColor} hover:shadow-lg relative overflow-hidden group h-full`}
        onClick={onClick}
      >
        {/* Background pattern */}
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="75" cy="25" r="50" fill="currentColor" className={color} />
          </svg>
        </div>
        
        {showBackButton && onBackClick && (
          <Button
            variant="ghost" 
            size="sm"
            className="absolute top-2 left-2 p-1 h-8 w-8 rounded-full bg-background/80 hover:bg-background z-20"
            onClick={(e) => {
              e.stopPropagation();
              onBackClick();
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to dashboard</span>
          </Button>
        )}
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
            
            <div className="flex items-center mt-3 text-xs font-medium gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
              <TrendingUp className="h-3 w-3" />
              <span>{trendPercentage}% increase</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className={`h-12 w-12 rounded-lg ${color} ${bgColor.replace('50', '200')} flex items-center justify-center shadow-sm transition-transform transform group-hover:scale-110`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            
            <div className={`text-xs font-medium flex items-center gap-1 ${color} transition-all duration-300 group-hover:gap-2`}>
              <span>View Details</span>
              <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;
