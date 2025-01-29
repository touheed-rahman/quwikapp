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
      { id: "bicycles", name: "Bicycles" },
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
      { id: "ac", name: "ACs" },
      { id: "washing-machines", name: "Washing Machines" },
      { id: "refrigerators", name: "Refrigerators" },
      { id: "cameras", name: "Cameras" },
      { id: "laptops", name: "Laptops" },
      { id: "gaming", name: "Gaming Consoles" }
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
      { id: "jewelry", name: "Jewelry" },
      { id: "cosmetics", name: "Cosmetics" }
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
    id: "education",
    name: "Education",
    icon: "book",
    subcategories: [
      { id: "courses", name: "Courses" },
      { id: "tuitions", name: "Tuitions" },
      { id: "books", name: "Books" },
      { id: "study-materials", name: "Study Materials" }
    ]
  },
  {
    id: "pets",
    name: "Pets",
    icon: "pawprint",
    subcategories: [
      { id: "dogs", name: "Dogs" },
      { id: "cats", name: "Cats" },
      { id: "fish", name: "Fish" },
      { id: "birds", name: "Birds" },
      { id: "accessories", name: "Pet Accessories" }
    ]
  }
];