
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import { motion } from "framer-motion";

interface FormActionsProps {
  isSubmitting: boolean;
  onBack: () => void;
}

const FormActions = ({ isSubmitting, onBack }: FormActionsProps) => {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row gap-3 mt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Button
        type="button"
        variant="outline"
        className="flex-1 gap-2 border-primary/20 hover:bg-primary/5 transition-all"
        onClick={onBack}
        disabled={isSubmitting}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <Button 
        type="submit" 
        className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Posting Ad...
          </motion.div>
        ) : (
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Send className="h-4 w-4" />
            Post Ad
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
};

export default FormActions;
