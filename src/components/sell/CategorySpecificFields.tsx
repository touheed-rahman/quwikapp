
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { categories } from "@/types/categories";

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
  // Common fields across categories
  const [brand, setBrand] = useState("");
  
  // Vehicle specific fields
  const [kmDriven, setKmDriven] = useState("");
  const [yearManufactured, setYearManufactured] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [color, setColor] = useState("");
  
  // Electronics specific fields
  const [modelNumber, setModelNumber] = useState("");
  const [warranty, setWarranty] = useState("");
  
  // Furniture specific fields
  const [material, setMaterial] = useState("");
  const [dimensions, setDimensions] = useState("");
  
  // Fashion specific fields
  const [size, setSize] = useState("");
  const [styleType, setStyleType] = useState("");
  
  // Property specific fields
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [areaSize, setAreaSize] = useState("");
  const [furnishing, setFurnishing] = useState("");
  
  // Mobile specific fields
  const [storage, setStorage] = useState("");
  const [screenSize, setScreenSize] = useState("");
  const [batteryCapacity, setBatteryCapacity] = useState("");
  
  // The current year for the manufacturing year dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Check if brand should be shown for this category
  const shouldShowBrand = category === 'electronics' || category === 'mobile' || 
                        subcategory === 'spare-parts';

  // Update parent component when values change
  useEffect(() => {
    const formFields: Record<string, any> = {};
    
    // Only include brand if it's relevant for this category
    if (shouldShowBrand && brand) {
      formFields.brand = brand;
    }
    
    if (category === 'vehicles') {
      formFields.km_driven = kmDriven ? parseInt(kmDriven) : 0;
      formFields.specs = {
        year: yearManufactured ? parseInt(yearManufactured) : null,
        fuel_type: fuelType || null,
        transmission: transmission || null,
        color: color || null
      };
    } else if (category === 'electronics') {
      formFields.specs = {
        model_number: modelNumber || null,
        warranty: warranty || null
      };
    } else if (category === 'furniture') {
      formFields.specs = {
        material: material || null,
        dimensions: dimensions || null
      };
    } else if (category === 'fashion') {
      formFields.specs = {
        size: size || null,
        style: styleType || null
      };
    } else if (category === 'property') {
      formFields.specs = {
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        area_size: areaSize || null,
        furnishing: furnishing || null
      };
    } else if (category === 'mobile') {
      formFields.specs = {
        storage: storage || null,
        screen_size: screenSize || null,
        battery: batteryCapacity || null
      };
    }
    
    updateFormData(formFields);
  }, [
    category, subcategory, shouldShowBrand, brand, kmDriven, yearManufactured, fuelType, transmission, color,
    modelNumber, warranty, material, dimensions, size, styleType,
    bedrooms, bathrooms, areaSize, furnishing, storage, screenSize, batteryCapacity,
    updateFormData
  ]);

  // Find the subcategory display name for better UI
  const subcategoryName = categories
    .find(c => c.id === category)
    ?.subcategories.find(s => s.id === subcategory)?.name || subcategory;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-700">
        {subcategoryName} Details
      </h3>
      
      {/* Brand field - only shown for relevant categories */}
      {shouldShowBrand && (
        <div className="space-y-2">
          <Label htmlFor="brand">
            Brand
          </Label>
          <Input
            id="brand"
            type="text"
            placeholder="Enter brand name"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
      )}
      
      {/* VEHICLES specific fields */}
      {category === 'vehicles' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="kmDriven">Kilometers Driven *</Label>
            <Input
              id="kmDriven"
              type="number"
              placeholder="Enter kilometers driven"
              value={kmDriven}
              onChange={(e) => setKmDriven(e.target.value)}
              min="0"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="yearManufactured">Year of Manufacture *</Label>
            <Select 
              value={yearManufactured} 
              onValueChange={setYearManufactured}
            >
              <SelectTrigger id="yearManufactured">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select 
              value={fuelType} 
              onValueChange={setFuelType}
            >
              <SelectTrigger id="fuelType">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="cng">CNG</SelectItem>
                <SelectItem value="lpg">LPG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transmission">Transmission</Label>
            <Select 
              value={transmission} 
              onValueChange={setTransmission}
            >
              <SelectTrigger id="transmission">
                <SelectValue placeholder="Select transmission type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              type="text"
              placeholder="Enter vehicle color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </>
      )}
      
      {/* ELECTRONICS specific fields */}
      {category === 'electronics' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="modelNumber">Model Number</Label>
            <Input
              id="modelNumber"
              type="text"
              placeholder="Enter model number"
              value={modelNumber}
              onChange={(e) => setModelNumber(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="warranty">Warranty Information</Label>
            <Input
              id="warranty"
              type="text"
              placeholder="E.g., 1 year manufacturer warranty"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
            />
          </div>
        </>
      )}
      
      {/* FURNITURE specific fields */}
      {category === 'furniture' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              type="text"
              placeholder="E.g., Wood, Metal, Glass"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              type="text"
              placeholder="E.g., 120 x 60 x 75 cm (L x W x H)"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
            />
          </div>
        </>
      )}
      
      {/* FASHION specific fields */}
      {category === 'fashion' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Input
              id="size"
              type="text"
              placeholder="E.g., S, M, L, XL, 32, 34"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="styleType">Style</Label>
            <Input
              id="styleType"
              type="text"
              placeholder="E.g., Casual, Formal, Sports"
              value={styleType}
              onChange={(e) => setStyleType(e.target.value)}
            />
          </div>
        </>
      )}
      
      {/* PROPERTY specific fields */}
      {category === 'property' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Select 
              value={bedrooms} 
              onValueChange={setBedrooms}
            >
              <SelectTrigger id="bedrooms">
                <SelectValue placeholder="Select number of bedrooms" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Select 
              value={bathrooms} 
              onValueChange={setBathrooms}
            >
              <SelectTrigger id="bathrooms">
                <SelectValue placeholder="Select number of bathrooms" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="areaSize">Area Size</Label>
            <Input
              id="areaSize"
              type="text"
              placeholder="E.g., 1200 sq. ft."
              value={areaSize}
              onChange={(e) => setAreaSize(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="furnishing">Furnishing</Label>
            <Select 
              value={furnishing} 
              onValueChange={setFurnishing}
            >
              <SelectTrigger id="furnishing">
                <SelectValue placeholder="Select furnishing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="furnished">Fully Furnished</SelectItem>
                <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                <SelectItem value="unfurnished">Unfurnished</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      
      {/* MOBILE specific fields */}
      {category === 'mobile' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="storage">Storage</Label>
            <Input
              id="storage"
              type="text"
              placeholder="E.g., 128GB, 256GB"
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="screenSize">Screen Size</Label>
            <Input
              id="screenSize"
              type="text"
              placeholder="E.g., 6.1 inches"
              value={screenSize}
              onChange={(e) => setScreenSize(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="batteryCapacity">Battery Capacity</Label>
            <Input
              id="batteryCapacity"
              type="text"
              placeholder="E.g., 4000mAh"
              value={batteryCapacity}
              onChange={(e) => setBatteryCapacity(e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CategorySpecificFields;
