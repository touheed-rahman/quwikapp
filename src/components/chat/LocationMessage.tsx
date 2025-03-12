
import { MapPin } from "lucide-react";

interface LocationMessageProps {
  latitude: number;
  longitude: number;
  locationName?: string;
}

const LocationMessage = ({ latitude, longitude, locationName }: LocationMessageProps) => {
  const handleOpenMap = () => {
    window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank');
  };

  return (
    <div className="w-full max-w-[260px]" onClick={handleOpenMap}>
      <div className="relative bg-black/5 border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
        <div className="aspect-[16/9] bg-muted flex items-center justify-center">
          <img 
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=400x200&markers=color:red%7C${latitude},${longitude}&key=YOUR_API_KEY`} 
            alt="Map location"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {locationName || "Shared location"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMessage;
