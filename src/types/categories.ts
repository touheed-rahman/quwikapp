
export type ProductCondition = "new" | "excellent" | "good" | "moderate";

export const categories = [
  {
    id: "mobile",
    name: "Mobile Phones",
    icon: "smartphone",
    subcategories: [
      { id: "smartphones", name: "Mobile Phones" },
      { id: "accessories", name: "Accessories" },
      { id: "tablets", name: "Tablets" }
    ]
  },
  {
    id: "vehicles",
    name: "Vehicles",
    icon: "car",
    subcategories: [
      { id: "cars", name: "Cars" },
      { id: "bikes", name: "Bikes" },
      { id: "motorcycles", name: "Motorcycles" },
      { id: "scooters", name: "Scooters" },
      { id: "spare-parts", name: "Spare Parts" },
      { id: "bicycles", name: "Bicycles" }
    ]
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "tv",
    subcategories: [
      { id: "tv-audio", name: "TVs, Video - Audio" },
      { id: "kitchen", name: "Kitchen & Other Appliances" },
      { id: "computers", name: "Computers & Laptops" },
      { id: "cameras", name: "Cameras & Lenses" },
      { id: "games", name: "Games & Entertainment" },
      { id: "fridges", name: "Fridges" },
      { id: "computer-accessories", name: "Computer Accessories" },
      { id: "hard-disks", name: "Hard Disks, Printers & Monitors" },
      { id: "acs", name: "ACs" },
      { id: "washing-machines", name: "Washing Machines" }
    ]
  },
  {
    id: "property",
    name: "Properties",
    icon: "house",
    subcategories: [
      { id: "for-sale", name: "For Sale: Houses & Apartments" },
      { id: "for-rent", name: "For Rent: Houses & Apartments" },
      { id: "lands", name: "Lands & Plots" },
      { id: "shops-rent", name: "For Rent: Shops & Offices" },
      { id: "shops-sale", name: "For Sale: Shops & Offices" },
      { id: "pg", name: "PG & Guest Houses" }
    ]
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: "sofa",
    subcategories: [
      { id: "sofa-dining", name: "Sofa & Dining" },
      { id: "beds", name: "Beds & Wardrobes" },
      { id: "home-decor", name: "Home Decor & Garden" },
      { id: "kids-furniture", name: "Kids Furniture" },
      { id: "other-household", name: "Other Household Items" }
    ]
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "tshirt",
    subcategories: [
      { id: "men", name: "Men" },
      { id: "women", name: "Women" },
      { id: "kids", name: "Kids" }
    ]
  },
  {
    id: "jobs",
    name: "Jobs",
    icon: "briefcase",
    subcategories: [
      { id: "data-entry", name: "Data entry & Back office" },
      { id: "sales", name: "Sales & Marketing" },
      { id: "bpo", name: "BPO & Telecaller" },
      { id: "driver", name: "Driver" },
      { id: "office", name: "Office Assistant" },
      { id: "delivery", name: "Delivery & Collection" },
      { id: "teacher", name: "Teacher" },
      { id: "cook", name: "Cook" },
      { id: "receptionist", name: "Receptionist & Front office" },
      { id: "operator", name: "Operator & Technician" },
      { id: "it", name: "IT Engineer & Developer" },
      { id: "hotel", name: "Hotel & Travel Executive" },
      { id: "accountant", name: "Accountant" },
      { id: "designer", name: "Designer" },
      { id: "other", name: "Other Jobs" }
    ]
  },
  {
    id: "services",
    name: "Services",
    icon: "wrench",
    subcategories: [
      { id: "education", name: "Education & Classes" },
      { id: "tours", name: "Tours & Travel" },
      { id: "electronics", name: "Electronics Repair & Services" },
      { id: "health", name: "Health & Beauty" },
      { id: "renovation", name: "Home Renovation & Repair" },
      { id: "cleaning", name: "Cleaning & Pest Control" },
      { id: "legal", name: "Legal & Documentation Services" },
      { id: "packers", name: "Packers & Movers" },
      { id: "other-services", name: "Other Services" }
    ]
  },
  {
    id: "books",
    name: "Books & Hobbies",
    icon: "book",
    subcategories: [
      { id: "books", name: "Books" },
      { id: "gym", name: "Gym & Fitness" },
      { id: "musical", name: "Musical Instruments" },
      { id: "sports", name: "Sports Equipment" },
      { id: "other-hobbies", name: "Other Hobbies" }
    ]
  },
  {
    id: "pets",
    name: "Pets",
    icon: "pawprint",
    subcategories: [
      { id: "fishes", name: "Fishes & Aquarium" },
      { id: "pet-food", name: "Pet Food & Accessories" },
      { id: "dogs", name: "Dogs" },
      { id: "other-pets", name: "Other Pets" }
    ]
  }
];
