
import { ArrowUpRight } from "lucide-react";
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card 
        className={`p-6 ${bgColor} border-none cursor-pointer transition-all duration-200 ${hoverBgColor} hover:shadow-md`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Icon className={`h-8 w-8 ${color}`} />
            <div className={`text-xs font-medium flex items-center gap-1 ${color}`}>
              <span>View</span>
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;
