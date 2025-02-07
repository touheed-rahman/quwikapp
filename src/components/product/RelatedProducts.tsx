
import ProductCard from "@/components/ProductCard";
import { ProductCondition } from "@/types/categories";

interface RelatedProduct {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  condition: ProductCondition;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
