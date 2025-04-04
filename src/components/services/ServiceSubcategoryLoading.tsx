
import { motion } from "framer-motion";

const ServiceSubcategoryLoading = () => {
  return (
    <div className="py-8 text-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 bg-primary/10 rounded w-48 mb-4"></div>
        <div className="h-4 bg-primary/10 rounded w-64"></div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-primary/5 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceSubcategoryLoading;
