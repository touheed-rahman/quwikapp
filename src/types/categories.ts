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
    name: "Cars & Bikes",
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
    icon: "building2",
    subcategories: [
      { id: "sale", name: "Houses for Sale" },
      { id: "rent", name: "Apartments for Rent" },
      { id: "plots", name: "Plots" },
      { id: "commercial", name: "Commercial Properties" }
    ]
  },
  {
    id: "home",
    name: "Home & Garden",
    icon: "sofa",
    subcategories: [
      { id: "furniture", name: "Furniture" },
      { id: "decor", name: "Decor" },
      { id: "kitchen", name: "Kitchenware" },
      { id: "garden", name: "Gardening Tools" }
    ]
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "shirt",
    subcategories: [
      { id: "clothing", name: "Clothing" },
      { id: "footwear", name: "Footwear" },
      { id: "watches", name: "Watches" },
      { id: "jewelry", name: "Jewelry" }
    ]
  },
  {
    id: "jobs",
    name: "Jobs",
    icon: "briefcase",
    subcategories: [
      { id: "full-time", name: "Full-time Jobs" },
      { id: "part-time", name: "Part-time Jobs" },
      { id: "internships", name: "Internships" },
      { id: "remote", name: "Work-from-Home" }
    ]
  },
  {
    id: "services",
    name: "Services",
    icon: "wrench",
    subcategories: [
      { id: "tutors", name: "Tutors" },
      { id: "events", name: "Event Planners" },
      { id: "repair", name: "Repair Services" },
      { id: "cleaning", name: "Cleaning Services" }
    ]
  },
  {
    id: "hobbies",
    name: "Hobbies & Sports",
    icon: "dumbbell",
    subcategories: [
      { id: "music", name: "Musical Instruments" },
      { id: "sports", name: "Sports Equipment" },
      { id: "toys", name: "Toys" },
      { id: "books", name: "Books" }
    ]
  },
  {
    id: "business",
    name: "Business",
    icon: "briefcase",
    subcategories: [
      { id: "machinery", name: "Machinery" },
      { id: "tools", name: "Tools" },
      { id: "office", name: "Office Equipment" },
      { id: "materials", name: "Raw Materials" }
    ]
  }
];