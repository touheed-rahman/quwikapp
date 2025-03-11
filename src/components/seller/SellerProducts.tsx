
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Eye, Trash2, Tag } from "lucide-react";
import { Link } from "react-router-dom";

interface SellerProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  status: string;
  view_count: number;
  featured: boolean;
}

const SellerProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Could not load your products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const { error } = await supabase
        .from('listings')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== id));
      toast({
        title: "Product deleted",
        description: "Your product has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Could not delete the product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFirstImageUrl = (images: string[]) => {
    if (!images || images.length === 0) return "/placeholder.svg";
    return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
  };

  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter(p => p.status === activeTab);

  if (isLoading) {
    return <div className="p-8 text-center">Loading your products...</div>;
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="approved">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-28 h-24">
                  <img
                    src={getFirstImageUrl(product.images)}
                    alt={product.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium">{product.title}</h3>
                  <p className="text-lg font-bold text-primary mt-1">
                    ₹{product.price.toLocaleString()}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant={product.status === 'approved' ? 'default' : 
                      product.status === 'pending' ? 'secondary' : 'destructive'}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </Badge>
                    
                    {product.featured && (
                      <Badge variant="secondary" className="bg-yellow-500 text-white">
                        Featured
                      </Badge>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{product.view_count || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-2 self-end md:self-center">
                  <Link to={`/product/${product.id}`}>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link to={`/sell?edit=${product.id}`}>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
