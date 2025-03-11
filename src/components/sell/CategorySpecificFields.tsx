
import { useState, useEffect } from "react";
import { categories } from "@/types/categories";
import VehicleFields from "./category-fields/VehicleFields";
import ElectronicsFields from "./category-fields/ElectronicsFields";
import FurnitureFields from "./category-fields/FurnitureFields";
import FashionFields from "./category-fields/FashionFields";
import PropertyFields from "./category-fields/PropertyFields";
import MobileFields from "./category-fields/MobileFields";
import BrandInput from "./category-fields/BrandInput";

interface CategorySpecificFieldsProps {
  category: string;
  subcategory: string;
  updateFormData: (fields: Record<string, any>) => void;
}

const CategorySpecificFields = ({ 
  category, 
  subcategory,
  updateFormData 
}: CategorySpecificFieldsProps) => {
  // Check if brand should be shown for this category
  const shouldShowBrand = category === 'electronics' || category === 'mobile' || 
                        subcategory === 'spare-parts';

  // Find the subcategory display name for better UI
  const subcategoryName = categories
    .find(c => c.id === category)
    ?.subcategories.find(s => s.id === subcategory)?.name || subcategory;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-700">
        {subcategoryName} Details
      </h3>
      
      {/* Render different fields based on category */}
      {category === 'vehicles' && (
        <VehicleFields 
          updateFormData={updateFormData} 
          subcategory={subcategory}
        />
      )}
      
      {category === 'electronics' && (
        <ElectronicsFields 
          updateFormData={updateFormData} 
          showBrand={shouldShowBrand} 
        />
      )}
      
      {category === 'furniture' && (
        <FurnitureFields updateFormData={updateFormData} />
      )}
      
      {category === 'fashion' && (
        <FashionFields updateFormData={updateFormData} />
      )}
      
      {category === 'property' && (
        <PropertyFields updateFormData={updateFormData} />
      )}
      
      {category === 'mobile' && (
        <MobileFields 
          updateFormData={updateFormData} 
          showBrand={shouldShowBrand} 
        />
      )}
      
      {/* For other categories that may only need the brand field */}
      {shouldShowBrand && 
       category !== 'electronics' && 
       category !== 'mobile' && (
        <BrandInput updateFormData={updateFormData} />
      )}
    </div>
  );
};

export default CategorySpecificFields;
