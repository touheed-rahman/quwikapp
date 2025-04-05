
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type ServiceBackButtonProps = {
  onBack?: () => void;
  showButton: boolean;
  title?: string;
  to?: string;
};

const ServiceBackButton = ({ onBack, showButton, title, to }: ServiceBackButtonProps) => {
  const navigate = useNavigate();
  
  if (!showButton) return null;
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <div className="mb-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleBack}
        className="flex items-center gap-1 text-primary hover:bg-primary/10"
      >
        <ArrowLeft className="h-4 w-4" />
        {title || "Back"}
      </Button>
    </div>
  );
};

export default ServiceBackButton;
