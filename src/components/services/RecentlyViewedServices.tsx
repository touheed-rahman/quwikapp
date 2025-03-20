
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type RecentlyViewedServicesProps = {
  recentlyViewed: {id: string, name: string}[];
  onSelectRecent: (categoryId: string) => void;
};

const RecentlyViewedServices = ({ recentlyViewed, onSelectRecent }: RecentlyViewedServicesProps) => {
  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-50 p-6 rounded-lg border"
    >
      <h2 className="text-xl font-semibold mb-4">Recently Viewed</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {recentlyViewed.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            className="whitespace-nowrap"
            onClick={() => {
              const categoryId = item.id.split('-')[0];
              onSelectRecent(categoryId);
            }}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentlyViewedServices;
