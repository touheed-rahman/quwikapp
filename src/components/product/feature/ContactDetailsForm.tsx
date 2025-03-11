
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserDetails } from "./types";

interface ContactDetailsFormProps {
  userDetails: UserDetails;
  onUserDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ContactDetailsForm({ 
  userDetails, 
  onUserDetailsChange 
}: ContactDetailsFormProps) {
  return (
    <div className="space-y-4 my-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="Your full name" 
          value={userDetails.name}
          onChange={onUserDetailsChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          name="phone" 
          placeholder="Your phone number" 
          value={userDetails.phone}
          onChange={onUserDetailsChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input 
          id="address" 
          name="address" 
          placeholder="Your address" 
          value={userDetails.address}
          onChange={onUserDetailsChange}
        />
      </div>
    </div>
  );
}
