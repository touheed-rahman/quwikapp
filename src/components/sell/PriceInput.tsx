
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
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
        <Input 
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-8 border-primary/20 focus-visible:ring-primary/30 shadow-sm transition-all duration-200" 
          placeholder="Enter price"
          required
        />
      </div>
      
      <motion.div 
        className="bg-primary/5 rounded-md p-2 text-xs text-primary-foreground/80"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.2 }}
      >
        <p className="font-medium">💡 Pricing Tips:</p>
        <ul className="mt-1 space-y-1 list-disc list-inside">
          <li>Research similar items before setting your price</li>
          <li>Consider item condition when pricing</li>
          <li>Be open to reasonable offers from buyers</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default PriceInput;
