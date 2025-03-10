
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface ProductSpecsCardProps {
  brand?: string | null;
  specs?: Record<string, any> | null;
  km_driven?: number | null;
  category?: string;
  condition: string;
}

const ProductSpecsCard = ({ 
  brand, 
  specs, 
  km_driven, 
  category,
  condition 
}: ProductSpecsCardProps) => {
  // Helper function to get user-friendly label for spec keys
  const getSpecLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      // Vehicle specific fields
      'year': 'Year',
      'fuel_type': 'Fuel Type',
      'transmission': 'Transmission',
      'color': 'Color',
      'engine_capacity': 'Engine Capacity',
      'insurance_type': 'Insurance Type',
      'make_month': 'Make Month',
      'registration_place': 'Registration Place',
      'abs': 'ABS',
      'accidental': 'Accidental History',
      'adjustable_external_mirror': 'Adjustable External Mirror',
      'adjustable_steering': 'Adjustable Steering',
      'air_conditioning': 'Air Conditioning',
      'airbags': 'Number of Airbags',
      'alloy_wheels': 'Alloy Wheels',
      'anti_theft_device': 'Anti Theft Device',
      'aux_compatibility': 'AUX Compatibility',
      'battery_condition': 'Battery Condition',
      'bluetooth': 'Bluetooth',
      'certified': 'Vehicle Certified',
      'cruise_control': 'Cruise Control',
      'lock_system': 'Lock System',
      'navigation_system': 'Navigation System',
      'parking_sensors': 'Parking Sensors',
      'power_steering': 'Power Steering',
      'power_windows': 'Power Windows',
      'radio': 'AM/FM Radio',
      'rear_parking_camera': 'Rear Parking Camera',
      'service_history': 'Service History',
      'sunroof': 'Sunroof',
      'tyre_condition': 'Tyre Condition',
      'usb_compatibility': 'USB Compatibility',
      'exchange': 'Exchange Available',
      
      // Other category fields
      'model_number': 'Model Number',
      'warranty': 'Warranty',
      'material': 'Material',
      'dimensions': 'Dimensions',
      'size': 'Size',
      'style': 'Style',
      'bedrooms': 'Bedrooms',
      'bathrooms': 'Bathrooms',
      'area_size': 'Area',
      'furnishing': 'Furnishing',
      'storage': 'Storage',
      'screen_size': 'Screen Size',
      'battery': 'Battery',
      // Job specific fields
      'job_type': 'Job Type',
      'salary': 'Salary',
      'company': 'Company',
      'experience': 'Experience Required',
      'education': 'Education Required',
      // Service specific fields
      'service_type': 'Service Type',
      'duration': 'Duration',
      'availability': 'Availability',
      'provider': 'Service Provider',
      // Book & hobby specific fields
      'author': 'Author',
      'genre': 'Genre',
      'publisher': 'Publisher',
      'equipment_type': 'Equipment Type'
    };
    
    return labelMap[key] || key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Helper function to format specs values for display
  const formatSpecValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return 'Not specified';
    
    // Format specific keys
    switch(key) {
      case 'year':
        return value.toString();
      case 'fuel_type':
      case 'transmission':
      case 'furnishing':
      case 'job_type':
      case 'service_type':
      case 'availability':
        return value.charAt(0).toUpperCase() + value.slice(1);
      case 'bedrooms':
        return `${value} ${value === 1 ? 'Bedroom' : 'Bedrooms'}`;
      case 'bathrooms':
        return `${value} ${value === 1 ? 'Bathroom' : 'Bathrooms'}`;
      case 'salary':
        return typeof value === 'number' ? `₹${value.toLocaleString()} per month` : value;
      case 'experience':
        return typeof value === 'number' ? `${value} years` : value;
      case 'duration':
        return typeof value === 'number' ? `${value} hours` : value;
      case 'engine_capacity':
        return typeof value === 'number' ? `${value} cc` : value;
      // Format boolean values
      case 'abs':
      case 'accidental':
      case 'adjustable_steering':
      case 'alloy_wheels':
      case 'anti_theft_device':
      case 'aux_compatibility':
      case 'bluetooth':
      case 'certified':
      case 'cruise_control':
      case 'navigation_system': 
      case 'parking_sensors':
      case 'power_steering':
      case 'rear_parking_camera':
      case 'sunroof':
      case 'usb_compatibility':
      case 'exchange':
        return value === true || value === 'Yes' || value === 'yes' ? 'Yes' : 'No';
      default:
        return typeof value === 'object' ? JSON.stringify(value) : value.toString();
    }
  };

  // Group vehicle specs for better organization
  const groupVehicleSpecs = () => {
    if (!specs || category !== 'vehicles') return [];

    const groups = [
      {
        title: 'Basic Information',
        keys: ['year', 'fuel_type', 'transmission', 'color', 'engine_capacity', 'make_month', 'registration_place', 'insurance_type']
      },
      {
        title: 'Features',
        keys: ['air_conditioning', 'airbags', 'alloy_wheels', 'cruise_control', 'sunroof', 'navigation_system', 'power_steering', 'power_windows']
      },
      {
        title: 'Safety & Security',
        keys: ['abs', 'anti_theft_device', 'parking_sensors', 'rear_parking_camera', 'lock_system']
      },
      {
        title: 'Condition & History',
        keys: ['accidental', 'battery_condition', 'tyre_condition', 'service_history', 'certified']
      },
      {
        title: 'Connectivity',
        keys: ['bluetooth', 'aux_compatibility', 'usb_compatibility', 'radio']
      },
      {
        title: 'Additional',
        keys: ['adjustable_external_mirror', 'adjustable_steering', 'exchange']
      }
    ];

    return groups;
  };

  // Check if we have specifications to show
  const hasSpecs = (specs && Object.values(specs).some(value => value !== null)) || 
                   (brand) || 
                   (category === 'vehicles' && km_driven !== null);

  if (!hasSpecs) {
    return null;
  }

  const vehicleSpecGroups = groupVehicleSpecs();

  return (
    <Card className="p-3 md:p-4 max-w-full">
      <div className="space-y-2 md:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm md:text-base">Item Details</h2>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {condition}
          </Badge>
        </div>
        
        <Table>
          <TableBody>
            {/* Show brand if available */}
            {brand && (
              <TableRow>
                <TableCell className="font-medium text-xs md:text-sm py-2">
                  Brand
                </TableCell>
                <TableCell className="text-xs md:text-sm py-2">
                  {brand}
                </TableCell>
              </TableRow>
            )}
            
            {/* Show km_driven for vehicles */}
            {category === 'vehicles' && km_driven !== null && km_driven !== undefined && (
              <TableRow>
                <TableCell className="font-medium text-xs md:text-sm py-2">
                  Kilometers Driven
                </TableCell>
                <TableCell className="text-xs md:text-sm py-2">
                  {km_driven.toLocaleString()} km
                </TableCell>
              </TableRow>
            )}
            
            {/* For vehicles, show grouped specs */}
            {category === 'vehicles' && vehicleSpecGroups.length > 0 ? (
              <>
                {vehicleSpecGroups.map((group, groupIndex) => (
                  <React.Fragment key={`group-${groupIndex}`}>
                    {/* Only show group if it has at least one value */}
                    {group.keys.some(key => specs && specs[key] !== undefined && specs[key] !== null) && (
                      <>
                        {/* Group Title */}
                        <TableRow>
                          <TableCell 
                            colSpan={2} 
                            className="font-semibold text-xs md:text-sm py-2 bg-gray-50"
                          >
                            {group.title}
                          </TableCell>
                        </TableRow>
                        
                        {/* Group Specs */}
                        {group.keys.map(key => 
                          specs && specs[key] !== undefined && specs[key] !== null && (
                            <TableRow key={key}>
                              <TableCell className="font-medium text-xs md:text-sm py-2 pl-5">
                                {getSpecLabel(key)}
                              </TableCell>
                              <TableCell className="text-xs md:text-sm py-2">
                                {formatSpecValue(key, specs[key])}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </>
            ) : (
              /* For other categories, show all specs in a flat list */
              specs && Object.entries(specs)
                .filter(([_, value]) => value !== null)
                .map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium text-xs md:text-sm py-2">
                      {getSpecLabel(key)}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm py-2">
                      {formatSpecValue(key, value)}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ProductSpecsCard;
