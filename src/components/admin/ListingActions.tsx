
import { CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ListingActionsProps {
  listingId: string;
  onStatusUpdate: (listingId: string, status: string) => Promise<void>;
  onDelete: (listingId: string) => Promise<void>;
}

const ListingActions = ({ listingId, onStatusUpdate, onDelete }: ListingActionsProps) => {
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-red-50 hover:bg-red-100 text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(listingId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListingActions;
