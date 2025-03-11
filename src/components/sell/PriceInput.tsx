
import { Input } from "@/components/ui/input";
import { IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PriceInput = ({ value, onChange }: PriceInputProps) => {
  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <label className="text-sm font-medium block flex items-center">
        <IndianRupee className="h-4 w-4 mr-1.5 text-primary" />
        Price *
      </label>
      <div className="relative">
        <Input 
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-primary/20 focus-visible:ring-primary/30 shadow-sm transition-all duration-200" 
          placeholder="Enter price"
          required
        />
      </div>
    </motion.div>
  );
};

export default PriceInput;
