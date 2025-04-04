
import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ServiceRequestsMenu from "@/components/services/ServiceRequestsMenu";

type RequestsFloatingButtonProps = {
  session: any;
  isServiceProvider: boolean;
  requestCount: number;
};

const RequestsFloatingButton = ({ 
  session, 
  isServiceProvider, 
  requestCount 
}: RequestsFloatingButtonProps) => {
  if (!session || isServiceProvider) return null;
  
  return (
    <div className="fixed bottom-20 right-4 z-30">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            size="sm" 
            className="rounded-full h-12 w-12 shadow-lg bg-primary hover:bg-primary/90 text-white flex items-center justify-center"
          >
            <BellRing className="h-5 w-5" />
            {requestCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-red-500 hover:bg-red-600 p-0"
              >
                {requestCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              My Service Requests
            </SheetTitle>
            <SheetDescription>
              View and manage your service requests
            </SheetDescription>
          </SheetHeader>
          <ServiceRequestsMenu />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RequestsFloatingButton;
