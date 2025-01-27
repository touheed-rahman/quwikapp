export const categories = [
  {
    id: "vehicles",
    name: "Vehicles",
    icon: "Car",
    subcategories: [
      { id: "cars", name: "Cars" },
      { id: "motorcycles", name: "Motorcycles" },
      { id: "trucks", name: "Trucks" },
      { id: "auto-parts", name: "Auto Parts" }
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
    id: "mobile",
    name: "Mobile",
    icon: "Smartphone",
    subcategories: [
      { id: "phones", name: "Phones" },
      { id: "tablets", name: "Tablets" },
      { id: "accessories", name: "Accessories" }
    ]
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "Tv",
    subcategories: [
      { id: "laptops", name: "Laptops" },
      { id: "tvs", name: "TVs" },
      { id: "cameras", name: "Cameras" },
      { id: "gaming", name: "Gaming" }
    ]
  },
  {
    id: "jobs",
    name: "Jobs",
    icon: "Briefcase",
    subcategories: [
      { id: "it", name: "IT" },
      { id: "sales", name: "Sales" },
      { id: "marketing", name: "Marketing" },
      { id: "other-jobs", name: "Other Jobs" }
    ]
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "Shirt",
    subcategories: [
      { id: "clothing", name: "Clothing" },
      { id: "shoes", name: "Shoes" },
      { id: "accessories", name: "Accessories" }
    ]
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: "Sofa",
    subcategories: [
      { id: "living", name: "Living Room" },
      { id: "bedroom", name: "Bedroom" },
      { id: "kitchen", name: "Kitchen" },
      { id: "office", name: "Office" }
    ]
  }
];

export type ProductCondition = "new" | "excellent" | "good" | "moderate";