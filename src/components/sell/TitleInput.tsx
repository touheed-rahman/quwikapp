
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TitleInput = ({ value, onChange }: TitleInputProps) => {
  const maxLength = 100;
  const isAlmostFull = value.length > maxLength * 0.8;
  const isFull = value.length === maxLength;
  
  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="text-sm font-medium block flex items-center">
        <Tag className="h-4 w-4 mr-1.5 text-primary" />
        Ad title *
      </label>
      <Input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Mention the key features of your item (e.g. brand, model, age, type)"
        className="border-primary/20 focus-visible:ring-primary/30 shadow-sm transition-all duration-200"
        maxLength={maxLength}
        required 
      />
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          A good title helps your item get noticed
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

export default TitleInput;
