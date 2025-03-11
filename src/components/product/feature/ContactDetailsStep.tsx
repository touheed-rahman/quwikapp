
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ContactDetailsForm from "./ContactDetailsForm";
import { UserDetails } from "./types";
import LocationSelector from "@/components/LocationSelector";
import { useLocation } from "@/contexts/LocationContext";

interface ContactDetailsStepProps {
  userDetails: UserDetails;
  onUserDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationChange?: (location: string | null) => void;
}

export default function ContactDetailsStep({ 
  userDetails, 
  onUserDetailsChange,
  onLocationChange
}: ContactDetailsStepProps) {
  const { selectedLocation } = useLocation();

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Contact Details</DialogTitle>
        <DialogDescription>
          Please provide your contact information for this featured listing
        </DialogDescription>
      </DialogHeader>
      
      <ContactDetailsForm 
        userDetails={userDetails}
        onUserDetailsChange={onUserDetailsChange}
      />

      {onLocationChange && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Select Location</h3>
          <LocationSelector
            value={selectedLocation}
            onChange={onLocationChange}
          />
          <p className="text-xs text-muted-foreground mt-1">
            This helps us show your listing to relevant people in your area
          </p>
        </div>
      )}
    </>
  );
}
