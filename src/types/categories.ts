export type ProductCondition = "new" | "excellent" | "good" | "moderate";

export const categories = [
  {
    id: "mobile",
    name: "Mobile Phones",
    icon: "smartphone",
    subcategories: [
      { id: "smartphones", name: "Smartphones" },
      { id: "feature-phones", name: "Feature Phones" },
      { id: "tablets", name: "Tablets" },
      { id: "accessories", name: "Mobile Accessories" },
      { id: "other", name: "Other Mobile Items" }
    ]
  },
  {
    id: "vehicles",
    name: "Vehicles",
    icon: "car",
    subcategories: [
      { id: "cars", name: "Cars" },
      { id: "motorcycles", name: "Motorcycles" },
      { id: "scooters", name: "Scooters" },
      { id: "commercial", name: "Commercial Vehicles" },
      { id: "spare-parts", name: "Spare Parts" }
    ]
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "tv",
    subcategories: [
      { id: "tv", name: "TVs" },
      { id: "laptops", name: "Laptops" },
      { id: "gaming", name: "Gaming Consoles" },
      { id: "cameras", name: "Cameras" },
      { id: "accessories", name: "Accessories" }
    ]
  },
  {
    id: "property",
    name: "Real Estate",
    icon: "house",
    subcategories: [
      { id: "sale", name: "Houses for Sale" },
      { id: "rent", name: "Apartments for Rent" },
      { id: "plots", name: "Plots" },
      { id: "commercial", name: "Commercial Properties" }
    ]
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "tshirt",
    subcategories: [
      { id: "clothing", name: "Clothing" },
      { id: "footwear", name: "Footwear" },
      { id: "watches", name: "Watches" },
      { id: "jewelry", name: "Jewelry" }
    ]
  }
];