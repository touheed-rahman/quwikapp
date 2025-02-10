
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Share2, BookMarked } from "lucide-react";

const ProfileStats = ({ userId }: { userId: string }) => {
  const { data: listingCount = 0 } = useQuery({
    queryKey: ['listing-count', userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: savedCount = 0 } = useQuery({
    queryKey: ['saved-count', userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('wishlists')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">My Listings</p>
            <p className="text-2xl font-semibold">{listingCount}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Saved Items</p>
            <p className="text-2xl font-semibold">{savedCount}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileStats;
