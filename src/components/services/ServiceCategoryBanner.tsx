
import { Shield, Star, Clock } from "lucide-react";

interface ServiceCategoryBannerProps {
  categoryName: string;
  description?: string;
}

const ServiceCategoryBanner = ({ categoryName, description }: ServiceCategoryBannerProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-6 mb-6">
      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl font-medium mb-2">Professional {categoryName} Services</h3>
        <p className="text-muted-foreground max-w-3xl">
          {description || `Choose from our range of professional ${categoryName.toLowerCase()} services tailored to your needs. Our certified experts deliver high-quality services at competitive prices.`}
        </p>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>Verified Professionals</span>
          </div>
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
            <Star className="h-3.5 w-3.5 text-yellow-500" />
            <span>Top Rated Services</span>
          </div>
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>On-time Service</span>
          </div>
        </div>
      </div>
      
      <div className="absolute -right-12 -bottom-12 h-48 w-48 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute right-24 -top-12 h-32 w-32 bg-primary/10 rounded-full blur-2xl"></div>
    </div>
  );
};

export default ServiceCategoryBanner;
