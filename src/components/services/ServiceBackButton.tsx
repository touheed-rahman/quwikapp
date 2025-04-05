
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type ServiceBackButtonProps = {
  onBack: () => void;
  showButton: boolean;
  title?: string;
};

const ServiceBackButton = ({ onBack, showButton, title }: ServiceBackButtonProps) => {
  if (!showButton) return null;
  
  return (
    <div className="mb-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBack}
        className="flex items-center gap-1 text-primary hover:bg-primary/10"
      >
        <ArrowLeft className="h-4 w-4" />
        {title || "Back"}
      </Button>
    </div>
  );
};

export default ServiceBackButton;
