
import { Loader2 } from "lucide-react";

const ListingLoader = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default ListingLoader;
