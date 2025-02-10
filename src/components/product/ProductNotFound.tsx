
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

const ProductNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Button 
            className="mt-4"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProductNotFound;
