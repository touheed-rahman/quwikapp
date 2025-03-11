
// Common keywords grouped by category
export const keywordsByCategory: Record<string, string[]> = {
  // General marketplace keywords
  general: [
    "local marketplace",
    "buy and sell online",
    "classified ads",
    "second hand items",
    "pre-owned goods",
    "used products for sale",
    "local deals",
    "nearby shopping",
    "online bazaar",
    "C2C marketplace",
    "consumer to consumer",
    "local classifieds",
    "online flea market",
    "best deals near me",
    "discount shopping"
  ],
  
  // Electronics category
  electronics: [
    "used electronics",
    "second hand gadgets",
    "refurbished devices",
    "pre-owned electronics",
    "cheap laptops",
    "used computers",
    "second hand TVs",
    "affordable gadgets",
    "discount electronics",
    "used gaming consoles",
    "refurbished phones",
    "second hand cameras",
    "affordable tech devices"
  ],
  
  // Mobile phones category
  mobiles: [
    "used mobile phones",
    "second hand smartphones",
    "refurbished iPhones",
    "pre-owned Android phones",
    "cheap smartphones",
    "used Samsung phones",
    "second hand Apple devices",
    "refurbished mobile phones",
    "affordable smartphones",
    "barely used phones",
    "mint condition phones"
  ],
  
  // Vehicles category
  vehicles: [
    "used cars for sale",
    "second hand vehicles",
    "pre-owned bikes",
    "affordable cars",
    "used motorcycles",
    "second hand bikes",
    "cheap scooters",
    "used auto parts",
    "second hand commercial vehicles",
    "affordable transportation",
    "low mileage used cars"
  ],
  
  // Furniture category
  furniture: [
    "used furniture",
    "second hand sofas",
    "pre-owned tables",
    "cheap beds",
    "used office furniture",
    "second hand chairs",
    "affordable wardrobes",
    "used dining tables",
    "home furniture deals",
    "wooden furniture second hand"
  ],
  
  // Fashion category
  fashion: [
    "used clothes",
    "second hand fashion",
    "pre-owned designer wear",
    "affordable clothing",
    "vintage fashion",
    "second hand shoes",
    "used handbags",
    "pre-owned jewelry",
    "cheap accessories",
    "branded clothes second hand"
  ],
  
  // Real estate category
  realestate: [
    "property for sale",
    "houses for rent",
    "apartments for sale",
    "affordable housing",
    "real estate deals",
    "land for sale",
    "commercial property",
    "office space for rent",
    "residential plots",
    "builder floors"
  ]
};

// Long-tail keywords for better search ranking
export const longTailKeywords: Record<string, string[]> = {
  general: [
    "how to find best deals on second hand items",
    "where to buy affordable used products online",
    "safest marketplace to buy and sell locally",
    "best platform for selling unused items quickly",
    "trusted online marketplace for used products"
  ],
  
  electronics: [
    "where to find affordable second hand laptops",
    "how to buy refurbished electronics safely",
    "best deals on barely used gaming consoles",
    "affordable alternatives to new electronics",
    "how to check condition of used electronics before buying"
  ],
  
  mobiles: [
    "best place to buy certified refurbished iPhones",
    "how to sell old smartphone for best price",
    "checklist for buying used mobile phones",
    "affordable alternatives to new smartphones",
    "where to find mint condition second hand phones"
  ]
};

// Question-based keywords for voice search optimization
export const questionKeywords: string[] = [
  "where can I sell my old phone",
  "how to find second hand furniture near me",
  "where to buy used electronics safely",
  "how much is my used car worth",
  "where can I get the best price for used items",
  "how to verify sellers on online marketplaces",
  "what should I check before buying a used mobile phone",
  "how to negotiate price for second hand items",
  "where can I find affordable used laptops",
  "how to take good photos of items for selling online"
];

// Seasonal and trending keywords
export const seasonalKeywords: Record<string, string[]> = {
  summer: [
    "used air conditioners",
    "second hand coolers",
    "affordable summer gear",
    "pre-owned camping equipment",
    "used outdoor furniture"
  ],
  festive: [
    "second hand festival items",
    "used decorative items",
    "pre-owned gift items",
    "affordable festive wear",
    "second hand celebration items"
  ],
  academic: [
    "used textbooks",
    "second hand study materials",
    "affordable school supplies",
    "pre-owned musical instruments",
    "used educational gadgets"
  ]
};

// Get keywords based on product details
export const getProductKeywords = (
  title: string,
  category?: string,
  brand?: string | null,
  condition?: string
): string[] => {
  // Base keywords from title and basics
  const baseKeywords = [
    title,
    brand || '',
    `${condition || ''} ${category || ''}`,
  ].filter(k => k.trim() !== '');
  
  // Category specific keywords
  const categoryKey = category?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'general';
  const categoryKeywords = keywordsByCategory[categoryKey] || keywordsByCategory.general;
  
  // Select 5 random keywords from the category
  const randomCategoryKeywords = categoryKeywords
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);
  
  return [...baseKeywords, ...randomCategoryKeywords];
};

// Get SEO title with keywords
export const getSeoTitle = (
  title: string,
  category?: string,
  condition?: string,
  location?: string
): string => {
  if (category && condition && location) {
    return `${title} | ${condition} ${category} for sale in ${location} | Quwik`;
  }
  
  if (category && condition) {
    return `${title} | ${condition} ${category} for sale | Quwik`;
  }
  
  if (category) {
    return `${title} | ${category} for sale | Quwik`;
  }
  
  return `${title} | Buy & Sell on Quwik`;
};

// Get SEO description with keywords
export const getSeoDescription = (
  description: string,
  title: string,
  category?: string,
  price?: number,
  condition?: string
): string => {
  // Truncate description to reasonable length
  const shortDesc = description?.substring(0, 100) || '';
  
  if (category && price && condition) {
    return `${shortDesc}... Buy this ${condition} ${category} "${title}" for just ₹${price}. Safe, secure shopping on Quwik - your trusted local marketplace for the best deals.`;
  }
  
  if (category) {
    return `${shortDesc}... Find great deals on ${category} like "${title}" on Quwik. Your trusted local marketplace for affordable shopping and selling.`;
  }
  
  return `${shortDesc}... Discover amazing deals on Quwik, your local marketplace for safe buying and selling of pre-owned items at affordable prices.`;
};
