
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type ServiceBackButtonProps = {
  onBack: () => void;
  showButton: boolean;
};

const ServiceBackButton = ({ onBack, showButton }: ServiceBackButtonProps) => {
  if (!showButton) return null;
  
  return (
    <div className="mb-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBack}
        className="flex items-center gap-1 text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
    </div>
  );
};

export default ServiceBackButton;
