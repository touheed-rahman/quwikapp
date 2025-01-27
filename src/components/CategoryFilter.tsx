import { Car, Smartphone, Home, Briefcase, ShoppingBag, Sofa, Laptop, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const categories = [
  { name: "Vehicles", icon: Car },
  { name: "Mobile", icon: Smartphone },
  { name: "Property", icon: Home },
  { name: "Jobs", icon: Briefcase },
  { name: "Fashion", icon: ShoppingBag },
  { name: "Furniture", icon: Sofa },
  { name: "Electronics", icon: Laptop },
  { name: "More", icon: MoreHorizontal },
];

const CategoryFilter = () => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map(({ name, icon: Icon }) => (
        <Button
          key={name}
          variant="secondary"
          className="whitespace-nowrap rounded-full px-4 py-2 flex items-center gap-2"
        >
          <Icon className="h-4 w-4" />
          <span>{name}</span>
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;