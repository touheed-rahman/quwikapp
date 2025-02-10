
import { Eye, Heart } from "lucide-react";

interface ListingStatsProps {
  viewCount: number;
  saveCount: number;
}

const ListingStats = ({ viewCount, saveCount }: ListingStatsProps) => {
  return (
    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <Eye className="w-3.5 h-3.5" />
        {viewCount || 0} views
      </span>
      <span className="flex items-center gap-1">
        <Heart className="w-3.5 h-3.5" />
        {saveCount || 0} saves
      </span>
    </div>
  );
};

export default ListingStats;
