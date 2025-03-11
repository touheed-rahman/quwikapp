
import { Eye, Heart } from "lucide-react";

interface ListingStatsProps {
  viewCount: number;
  saveCount: number;
}

const ListingStats = ({ viewCount, saveCount }: ListingStatsProps) => {
  return (
    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Eye className="w-4 h-4" />
        {viewCount || 0} views
      </span>
      <span className="flex items-center gap-1.5">
        <Heart className="w-4 h-4" />
        {saveCount || 0} saves
      </span>
    </div>
  );
};

export default ListingStats;
