import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListingActionsProps {
  listingId: string;
  onStatusUpdate: (listingId: string, status: string) => Promise<void>;
}

const ListingActions = ({ listingId, onStatusUpdate }: ListingActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        className="bg-green-50 hover:bg-green-100 text-green-700"
        onClick={() => onStatusUpdate(listingId, 'approved')}
      >
        <CheckCircle2 className="h-4 w-4 mr-1" />
        Approve
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-red-50 hover:bg-red-100 text-red-700"
        onClick={() => onStatusUpdate(listingId, 'rejected')}
      >
        <XCircle className="h-4 w-4 mr-1" />
        Reject
      </Button>
    </div>
  );
};

export default ListingActions;