
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceSubcategoryHeaderProps {
  categoryName: string;
  onBack: () => void;
}

const ServiceSubcategoryHeader = ({ categoryName, onBack }: ServiceSubcategoryHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={onBack} className="p-0 h-9 w-9">
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <h2 className="text-2xl font-bold">{categoryName}</h2>
    </div>
  );
};

export default ServiceSubcategoryHeader;
