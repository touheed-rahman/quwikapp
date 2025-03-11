
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
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={() => onStatusUpdate(listingId, 'approved')}
      >
        <CheckCircle2 className="h-4 w-4 text-white" />
        <span className="text-white">Approve</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-red-500 hover:bg-red-600 text-white"
        onClick={() => onStatusUpdate(listingId, 'rejected')}
      >
        <XCircle className="h-4 w-4 text-white" />
        <span className="text-white">Reject</span>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white font-medium"
          >
            <Trash2 className="h-4 w-4 text-white" />
            <span className="text-white">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the listing and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(listingId)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListingActions;
