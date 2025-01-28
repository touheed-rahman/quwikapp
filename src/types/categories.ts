export const categories = [
  {
    id: "vehicles",
    name: "Cars & Bikes",
    icon: "car",
    subcategories: [
      { id: "cars", name: "Cars" },
      { id: "bikes", name: "Bikes & Scooters" },
      { id: "commercial", name: "Commercial Vehicles" },
      { id: "spare-parts", name: "Spare Parts" }
    ]
  },
  {
    id: "property",
    name: "Properties",
    icon: "home",
    subcategories: [
      { id: "sale", name: "For Sale: Houses & Apartments" },
      { id: "rent", name: "For Rent: Houses & Apartments" },
      { id: "land", name: "Land & Plots" },
      { id: "commercial", name: "Commercial Property" }
    ]
  },
  {
    id: "mobile",
    name: "Mobiles",
    icon: "smartphone",
    subcategories: [
      { id: "phones", name: "Mobile Phones" },
      { id: "tablets", name: "Tablets" },
      { id: "accessories", name: "Mobile Accessories" },
      { id: "wearables", name: "Smart Watches & Bands" }
    ]
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "monitor",
    subcategories: [
      { id: "laptops", name: "Laptops & Computers" },
      { id: "tv", name: "TVs & Home Entertainment" },
      { id: "cameras", name: "Cameras & Photography" },
      { id: "gaming", name: "Gaming Consoles" }
    ]
  },
  {
    id: "jobs",
    name: "Jobs",
    icon: "briefcase",
    subcategories: [
      { id: "tech", name: "Technology" },
      { id: "sales", name: "Sales & Marketing" },
      { id: "office", name: "Office Jobs" },
      { id: "other", name: "Other Jobs" }
    ]
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: "sofa",
    subcategories: [
      { id: "home", name: "Home Furniture" },
      { id: "office", name: "Office Furniture" },
      { id: "decor", name: "Home Decor" },
      { id: "garden", name: "Garden & Outdoor" }
    ]
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "shirt",
    subcategories: [
      { id: "men", name: "Men's Fashion" },
      { id: "women", name: "Women's Fashion" },
      { id: "kids", name: "Kids Fashion" },
      { id: "accessories", name: "Accessories" }
    ]
  },
  {
    id: "travel",
    name: "Travel",
    icon: "travel",
    subcategories: [
      { id: "packages", name: "Holiday Packages" },
      { id: "hotels", name: "Hotels & Resorts" },
      { id: "tickets", name: "Flight Tickets" }
    ]
  }
];

export type ProductCondition = "new" | "excellent" | "good" | "moderate";