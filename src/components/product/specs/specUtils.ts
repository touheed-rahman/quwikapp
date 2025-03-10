// Helper function to get user-friendly label for spec keys
export const getSpecLabel = (key: string): string => {
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
export const formatSpecValue = (key: string, value: any): string => {
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
