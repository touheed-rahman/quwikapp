
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const DescriptionInput = ({ value, onChange }: DescriptionInputProps) => {
  const maxLength = 2000;
  const isAlmostFull = value.length > maxLength * 0.9;
  const isFull = value.length === maxLength;
  
  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <label className="text-sm font-medium block flex items-center">
        <FileText className="h-4 w-4 mr-1.5 text-primary" />
        Description *
      </label>
      <Textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Include condition, features and reason for selling"
        className="min-h-[150px] resize-none border-primary/20 focus-visible:ring-primary/30 shadow-sm transition-all duration-200"
        maxLength={maxLength}
        required
      />
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Be detailed and honest about your item
        </p>
        <span className={`text-xs font-medium ${
          isFull ? "text-red-500" : 
          isAlmostFull ? "text-amber-500" : 
          "text-muted-foreground"
        }`}>
          {value.length}/{maxLength}
        </span>
      </div>
    </motion.div>
  );
};

export default DescriptionInput;
