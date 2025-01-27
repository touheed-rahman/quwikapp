import { Button } from "./ui/button";

const categories = [
  "All",
  "Electronics",
  "Vehicles",
  "Property",
  "Fashion",
  "Furniture",
  "Jobs",
];

const CategoryFilter = () => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant="secondary"
          className="whitespace-nowrap rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;