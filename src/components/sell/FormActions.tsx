
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Send } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  onBack: () => void;
}

const FormActions = ({ isSubmitting, onBack }: FormActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <Button
        type="button"
        variant="outline"
        className="flex-1 gap-2 border-primary/20 hover:bg-primary/5"
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
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Posting Ad...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Post Ad
          </>
        )}
      </Button>
    </div>
  );
};

export default FormActions;
