
import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatSpecValue, getSpecLabel } from "./specUtils";

interface VehicleSpecsDetailsProps {
  brand?: string | null;
  specs?: Record<string, any> | null;
  km_driven?: number | null;
}

const VehicleSpecsDetails = ({ 
  brand, 
  specs, 
  km_driven 
}: VehicleSpecsDetailsProps) => {
  // Group vehicle specs for better organization
  const groupVehicleSpecs = () => {
    if (!specs) return [];

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

  const vehicleSpecGroups = groupVehicleSpecs();

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
        
        {/* Show km_driven for vehicles */}
        {km_driven !== null && km_driven !== undefined && (
          <TableRow>
            <TableCell className="font-medium text-xs md:text-sm py-2">
              Kilometers Driven
            </TableCell>
            <TableCell className="text-xs md:text-sm py-2">
              {km_driven.toLocaleString()} km
            </TableCell>
          </TableRow>
        )}
        
        {/* Show grouped specs */}
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
      </TableBody>
    </Table>
  );
};

export default VehicleSpecsDetails;
