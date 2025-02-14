
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";

const ProductLoader = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </main>
    </div>
  );
};

export default ProductLoader;
