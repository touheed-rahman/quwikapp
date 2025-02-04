
import { Button } from "@/components/ui/button";
import { ProductCondition } from "@/types/categories";
import ProductCard from "../ProductCard";
import { categories } from "@/types/categories";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  created_at: string;
  condition: ProductCondition;
  category: string;
}

interface CategoryListingsProps {
  listings: Listing[];
  getFirstImageUrl: (images: string[]) => string;
}

const CategoryListings = ({ listings, getFirstImageUrl }: CategoryListingsProps) => {
  return (
    <>
      {categories.map((category) => {
        const categoryListings = listings
          .filter((listing) => listing.category === category.id)
          .slice(0, 4);

        return categoryListings.length > 0 ? (
          <section key={category.id}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{category.name}</h2>
              <Button variant="ghost" className="text-primary">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {categoryListings.map((listing) => (
                <ProductCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  location={listing.location || "Location not specified"}
                  image={getFirstImageUrl(listing.images)}
                  date={new Date(listing.created_at).toLocaleDateString()}
                  condition={listing.condition as ProductCondition}
                />
              ))}
            </div>
          </section>
        ) : null;
      })}
    </>
  );
};

export default CategoryListings;
