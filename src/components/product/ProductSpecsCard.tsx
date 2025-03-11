
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface ProductSpecsCardProps {
  brand?: string | null;
  specs?: Record<string, any> | null;
  category?: string;
  condition: string;
}

const ProductSpecsCard = ({ 
  brand, 
  specs, 
  category,
  condition 
}: ProductSpecsCardProps) => {
  // Helper function to get user-friendly label for spec keys
  const getSpecLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      'year': 'Year',
      'fuel_type': 'Fuel Type',
      'transmission': 'Transmission',
      'color': 'Color',
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
      default:
        return typeof value === 'object' ? JSON.stringify(value) : value.toString();
    }
  };

  // Check if we have specifications to show
  const hasSpecs = (specs && Object.values(specs).some(value => value !== null)) || (brand);

  if (!hasSpecs) {
    return null;
  }

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
            
            {/* Show all other specs */}
            {specs && Object.entries(specs)
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
            }
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ProductSpecsCard;
