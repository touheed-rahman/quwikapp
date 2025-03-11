
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
  const percentage = Math.round((value.length / maxLength) * 100);
  
  return (
    <motion.div 
      className="space-y-2.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="text-sm font-medium block flex items-center">
        <Tag className="h-4 w-4 mr-1.5 text-primary" />
        Ad title *
      </label>
      <div className="relative">
        <Input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Mention the key features of your item (e.g. brand, model, age, type)"
          className="border-primary/20 focus-visible:ring-primary/30 shadow-sm transition-all duration-200 pr-14"
          maxLength={maxLength}
          required 
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <motion.div
            className={`text-xs font-semibold rounded-full h-6 w-6 flex items-center justify-center
              ${isFull ? "bg-red-100 text-red-500" : 
                isAlmostFull ? "bg-amber-100 text-amber-500" : 
                "bg-primary/10 text-primary"}`}
            animate={{
              scale: value.length ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {percentage}%
          </motion.div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground flex justify-between">
        <span>A good title helps your item get noticed</span>
        <span className={`font-medium ${
          isFull ? "text-red-500" : 
          isAlmostFull ? "text-amber-500" : 
          "text-muted-foreground"
        }`}>
          {value.length}/{maxLength}
        </span>
      </p>
    </motion.div>
  );
};

export default TitleInput;
