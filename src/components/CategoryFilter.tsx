
import { useState } from "react";
import { categories } from "@/types/categories";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Laptop,
  Armchair,
  Building,
  Briefcase,
  Bike,
  GraduationCap,
  Dog,
  ShoppingBag,
  Gamepad2,
  Library,
  Wrench,
  ChevronDown,
  ChevronUp,
  Smartphone
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const categoryIcons: Record<string, any> = {
  mobile: Smartphone,
  vehicles: Car,
  electronics: Laptop,
  furniture: Armchair,
  property: Building,
  jobs: Briefcase,
  bikes: Bike,
  education: GraduationCap,
  pets: Dog,
  fashion: ShoppingBag,
  gaming: Gamepad2,
  books: Library,
  services: Wrench,
};

const categoryColors: Record<string, string> = {
  mobile: "bg-[#8B5CF6]", // Vivid purple color
  vehicles: "bg-blue-500",
  electronics: "bg-purple-500",
  furniture: "bg-orange-500",
  property: "bg-green-500",
  jobs: "bg-indigo-500",
  bikes: "bg-red-500",
  education: "bg-yellow-500",
  pets: "bg-pink-500",
  fashion: "bg-teal-500",
  gaming: "bg-violet-500",
  books: "bg-cyan-500",
  services: "bg-emerald-500",
};

const CategoryFilter = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const isMobile = useIsMobile();

  const itemsPerRow = isMobile ? 4 : 6;
  const initialRows = 1;
  
  // Create rows with items per row
  const rows = [];
  for (let i = 0; i < categories.length; i += itemsPerRow) {
    rows.push(categories.slice(i, i + itemsPerRow));
  }

  const visibleRows = showAll ? rows : rows.slice(0, initialRows);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ScrollArea className="w-full rounded-xl border border-primary/10 shadow-md bg-white overflow-hidden">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-lg font-bold text-foreground/90">Categories</h3>
            {rows.length > initialRows && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                {showAll ? (
                  <>
                    Show Less <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show All <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
          
          <AnimatePresence initial={false}>
            <motion.div 
              className="space-y-6 transition-all"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
            >
              {visibleRows.map((row, rowIndex) => (
                <motion.div 
                  key={rowIndex} 
                  className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  {row.map((category) => {
                    const Icon = categoryIcons[category.id] || Car;
                    const bgColor = categoryColors[category.id] || "bg-gray-500";
                    
                    return (
                      <motion.button
                        key={category.id}
                        onClick={() => navigate(`/category/${category.id}`)}
                        className="flex flex-col items-center justify-center gap-2 rounded-lg p-2 md:p-3 hover:bg-primary/5 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div 
                          className={`p-2.5 md:p-3 rounded-full ${bgColor} text-white shadow-md`}
                          whileHover={{ 
                            scale: 1.1,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                          }}
                        >
                          <Icon className="h-6 w-6 md:h-6 md:w-6" />
                        </motion.div>
                        <span className="text-xs md:text-sm font-medium text-center line-clamp-1">{category.name}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  );
};

export default CategoryFilter;
