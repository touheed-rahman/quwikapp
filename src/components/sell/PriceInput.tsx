
import { Input } from "@/components/ui/input";
import { IndianRupee, ArrowTrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PriceInput = ({ value, onChange }: PriceInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <motion.div 
      className="space-y-2.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <label className="text-sm font-medium block flex items-center">
        <IndianRupee className="h-4 w-4 mr-1.5 text-primary" />
        Price *
      </label>
      <div className="relative">
        <motion.span 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          animate={{ 
            scale: isFocused ? 1.2 : 1,
            color: isFocused ? "#9b87f5" : "#64748b"
          }}
          transition={{ duration: 0.2 }}
        >
          ₹
        </motion.span>
        <Input 
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-8 border-primary/20 focus-visible:ring-primary/30 shadow-sm transition-all duration-200" 
          placeholder="Enter price"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required
        />
      </div>
      
      <motion.div 
        className={`rounded-md p-3 text-xs ${value ? "bg-green-50 border border-green-100" : "bg-primary/5"}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.3 }}
      >
        <p className="font-medium flex items-center gap-1.5">
          <ArrowTrendingUp className="h-3.5 w-3.5 text-primary" />
          <span className={value ? "text-green-700" : "text-primary-foreground/80"}>Pricing Tips:</span>
        </p>
        <ul className="mt-1.5 space-y-1 list-disc list-inside text-foreground/80">
          <li>Research similar items before setting your price</li>
          <li>Consider item condition when pricing</li>
          <li>Be open to reasonable offers from buyers</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default PriceInput;
