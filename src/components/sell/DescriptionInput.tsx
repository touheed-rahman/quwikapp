
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const DescriptionInput = ({ value, onChange }: DescriptionInputProps) => {
  const maxLength = 2000;
  
  return (
    <motion.div 
      className="space-y-2.5"
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
          className="min-h-[150px] resize-none border-primary/20 focus-visible:ring-primary/30 shadow-sm transition-all duration-200"
          maxLength={maxLength}
          required
        />
      </div>
      
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Be detailed and honest about your item
        </p>
        
        {value.length > 0 && (
          <motion.div 
            className="bg-primary/5 rounded-md p-2.5 text-xs"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-medium text-primary">Writing tips:</p>
            <ul className="mt-1 space-y-1 list-disc list-inside text-foreground/80">
              <li>Include brand, model, and age</li>
              <li>Mention any defects or repairs needed</li>
              <li>Describe why you're selling the item</li>
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DescriptionInput;
