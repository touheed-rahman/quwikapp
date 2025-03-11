
import { useParams, Link } from "react-router-dom";
import { categories } from "@/types/categories";
import { ChevronRight, ArrowLeft, Tag, Layers } from "lucide-react";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CategorySubcategories = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-16 pb-24">
        <motion.div 
          className="space-y-6 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className="w-fit flex items-center gap-2 mb-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            
            <motion.div 
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-primary/10 p-1.5 rounded-full">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground/90">{category.name} Categories</h1>
            </motion.div>
            
            <motion.p 
              className="text-muted-foreground mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Select a subcategory to browse listings
            </motion.p>
          </div>
          
          <motion.div 
            className="grid gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
          >
            {category.subcategories.map((subcategory, index) => (
              <motion.div
                key={subcategory.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                <Link
                  to={`/category/${categoryId}/${subcategory.id}`}
                  className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between hover:border-primary/50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Tag className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-lg text-foreground/90 font-medium">{subcategory.name}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default CategorySubcategories;
