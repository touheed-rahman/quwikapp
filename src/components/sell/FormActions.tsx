
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  onBack: () => void;
}

const FormActions = ({ isSubmitting, onBack }: FormActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button
        type="button"
        variant="outline"
        className="flex-1"
        onClick={onBack}
        disabled={isSubmitting}
      >
        Back
      </Button>
      <Button 
        type="submit" 
        className="flex-1 bg-primary hover:bg-primary/90 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Posting Ad...
          </div>
        ) : (
          'Post Ad'
        )}
      </Button>
    </div>
  );
};

export default FormActions;
