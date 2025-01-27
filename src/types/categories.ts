export type CategoryType = {
  id: string;
  name: string;
  icon: string;
  subcategories: SubCategory[];
};

export type SubCategory = {
  id: string;
  name: string;
};

export const categories: CategoryType[] = [
  {
    id: "vehicles",
    name: "Vehicles",
    icon: "Car",
    subcategories: [
      { id: "cars", name: "Cars" },
      { id: "motorcycles", name: "Motorcycles" },
      { id: "trucks", name: "Trucks" },
      { id: "boats", name: "Boats" },
      { id: "other-vehicles", name: "Other Vehicles" }
    ]
  },
  {
    id: "mobile",
    name: "Mobile",
    icon: "Smartphone",
    subcategories: [
      { id: "smartphones", name: "Smartphones" },
      { id: "tablets", name: "Tablets" },
      { id: "accessories", name: "Accessories" }
    ]
  },
  {
    id: "property",
    name: "Property",
    icon: "Home",
    subcategories: [
      { id: "houses", name: "Houses" },
      { id: "apartments", name: "Apartments" },
      { id: "land", name: "Land" },
      { id: "commercial", name: "Commercial" }
    ]
  },
  {
    id: "jobs",
    name: "Jobs",
    icon: "Briefcase",
    subcategories: [
      { id: "it", name: "IT & Software" },
      { id: "sales", name: "Sales" },
      { id: "marketing", name: "Marketing" },
      { id: "education", name: "Education" }
    ]
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "ShoppingBag",
    subcategories: [
      { id: "clothing", name: "Clothing" },
      { id: "shoes", name: "Shoes" },
      { id: "accessories", name: "Accessories" },
      { id: "watches", name: "Watches" }
    ]
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: "Sofa",
    subcategories: [
      { id: "living-room", name: "Living Room" },
      { id: "bedroom", name: "Bedroom" },
      { id: "kitchen", name: "Kitchen" },
      { id: "office", name: "Office" }
    ]
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "Laptop",
    subcategories: [
      { id: "laptops", name: "Laptops" },
      { id: "desktops", name: "Desktops" },
      { id: "cameras", name: "Cameras" },
      { id: "gaming", name: "Gaming" }
    ]
  }
];