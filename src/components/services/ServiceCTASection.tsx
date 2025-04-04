
import { Wrench, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type ServiceCTASectionProps = {
  session: any;
  isServiceProvider: boolean;
};

const ServiceCTASection = ({ session, isServiceProvider }: ServiceCTASectionProps) => {
  const navigate = useNavigate();
  
  if (isServiceProvider) return null;
  
  if (session) {
    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Wrench className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-800">Hire Service Professionals</h3>
              <p className="text-blue-700/80">
                Book verified service professionals for all your home and business needs
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate('/services/search')}
              >
                Book a Service
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Briefcase className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-purple-800">Become a Service Provider</h3>
              <p className="text-purple-700/80">
                Apply to become a service professional and start receiving job requests
              </p>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => navigate('/service-center')}
              >
                Apply Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="mt-8 bg-primary/5 rounded-xl p-6 border border-primary/20">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-primary">Sign in to access service features</h3>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Sign in to book services, track your service requests, and access more features.
        </p>
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90"
          onClick={() => navigate('/profile')}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default ServiceCTASection;
