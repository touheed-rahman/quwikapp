
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  hoverBgColor: string;
  onClick: () => void;
  index: number;
}

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor, 
  hoverBgColor, 
  onClick, 
  index 
}: MetricCardProps) => {
  // Calculate a random but consistent trend percentage for demo purposes
  const trendPercentage = Math.floor(((index + 1) * 7) % 30);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card 
        className={`p-6 ${bgColor} border-none cursor-pointer transition-all duration-200 ${hoverBgColor} hover:shadow-lg relative overflow-hidden`}
        onClick={onClick}
      >
        {/* Background pattern */}
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="75" cy="25" r="50" fill="currentColor" className={color} />
          </svg>
        </div>
        
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
            <div className={`h-12 w-12 rounded-lg ${color} ${bgColor.replace('50', '200')} flex items-center justify-center`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            
            <div className={`text-xs font-medium flex items-center gap-1 ${color}`}>
              <span>View Details</span>
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;
