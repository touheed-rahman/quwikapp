
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatSpecValue, getSpecLabel } from "./specUtils";

interface GeneralSpecsDetailsProps {
  brand?: string | null;
  specs?: Record<string, any> | null;
  category?: string;
}

const GeneralSpecsDetails = ({ 
  brand, 
  specs, 
  category 
}: GeneralSpecsDetailsProps) => {
  return (
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
        
        {/* For other categories, show all specs in a flat list */}
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
  );
};

export default GeneralSpecsDetails;
