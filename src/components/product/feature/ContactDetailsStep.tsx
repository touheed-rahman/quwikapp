
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ContactDetailsForm from "./ContactDetailsForm";
import { UserDetails } from "./types";

interface ContactDetailsStepProps {
  userDetails: UserDetails;
  onUserDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ContactDetailsStep({ 
  userDetails, 
  onUserDetailsChange 
}: ContactDetailsStepProps) {
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
    </>
  );
}
