
import Header from "@/components/Header";
import { categories } from "@/types/categories";
import { ChevronRight, ArrowRight, Tag, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.subcategories.some(sub => 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <motion.div 
          className="space-y-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="space-y-2 mt-4">
            <h1 className="text-2xl md:text-3xl font-bold text-black flex items-center gap-2 section-title-with-icon">
              <Tag className="h-6 w-6 text-black" />
              Browse Categories
            </h1>
            <p className="text-black font-medium">Find what you're looking for by category</p>
          </motion.div>
          
          <motion.div variants={item} className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text"
                placeholder="Search categories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
          
          <motion.div variants={item}>
            <div className="grid gap-5">
              {filteredCategories.map((category, index) => (
                <motion.div 
                  key={category.id}
                  className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow"
                  variants={item}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-primary">{category.name}</h2>
                    <Link 
                      to={`/category/${category.id}`}
                      className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium"
                    >
                      View All <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {category.subcategories.map((sub) => (
                      <Link 
                        key={sub.id} 
                        to={`/category/${category.id}/${sub.id}`}
                        className="px-3 py-2 border rounded-lg text-sm text-black font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-black font-medium">No categories match your search.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Categories;
