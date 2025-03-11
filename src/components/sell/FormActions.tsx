
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Send, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormActionsProps {
  isSubmitting: boolean;
  onBack: () => void;
  isQVideo?: boolean;
}

const FormActions = ({ isSubmitting, onBack, isQVideo = false }: FormActionsProps) => {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row gap-3 mt-8 w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Button
        type="button"
        variant="outline"
        className="flex-1 gap-2 border-primary/20 hover:bg-primary/5 transition-all text-foreground"
        onClick={onBack}
        disabled={isSubmitting}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <AnimatePresence mode="wait">
        {isSubmitting ? (
          <motion.div
            key="submitting"
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button 
              type="button"
              disabled
              className="w-full bg-primary/80 text-white flex items-center gap-2 shadow-md"
            >
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="font-medium">{isQVideo ? 'Creating Q...' : 'Posting Ad...'}</span>
              </div>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="submit"
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isQVideo ? (
                  <>
                    <div className="font-bold">Q</div>
                    <span className="font-medium">Create Q</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span className="font-medium">Post Ad</span>
                  </>
                )}
              </motion.div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FormActions;
