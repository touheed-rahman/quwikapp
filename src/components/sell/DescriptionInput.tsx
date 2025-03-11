
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const DescriptionInput = ({ value, onChange }: DescriptionInputProps) => {
  return (
    <motion.div 
      className="space-y-1.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <label className="text-sm font-medium block flex items-center">
        <FileText className="h-4 w-4 mr-1.5 text-primary" />
        Description *
      </label>
      <div className="relative">
        <Textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Include condition, features and reason for selling"
          className="min-h-[90px] resize-none border-primary/20 focus-visible:ring-primary/30 shadow-sm transition-all duration-200"
          required
        />
      </div>
      
      <p className="text-xs text-muted-foreground">
        Be detailed and honest about your item
      </p>
    </motion.div>
  );
};

export default DescriptionInput;
