
import React, { useEffect } from "react";
import { Location } from "@/utils/locationUtils";
import LocationInput from "./LocationInput";
import { ChevronDownIcon, ArrowLeftIcon, NavigationIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JourneyPanelProps {
  origin: Location | null;
  destination: Location | null;
  onOriginChange: (location: Location | null) => void;
  onDestinationChange: (location: Location | null) => void;
  onBack: () => void;
  isExpanded: boolean;
}

const JourneyPanel: React.FC<JourneyPanelProps> = ({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onBack,
  isExpanded,
}) => {
  useEffect(() => {
    if (!isExpanded) {
      onDestinationChange(null);
    }
  }, [isExpanded, onDestinationChange]);
  
  return (
    <div 
      className={`
        w-full max-w-xl glass-panel rounded-xl overflow-hidden transition-all duration-500 ease-in-out
        ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-20px] pointer-events-none'}
      `}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold">Find Route</h2>
          <div className="w-9"></div> {/* Spacer to center the title */}
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <LocationInput
              placeholder="From"
              value={origin}
              onChange={onOriginChange}
              autoFocus={isExpanded && !origin}
            />
          </div>
          
          <div className="relative">
            <LocationInput
              placeholder="To"
              value={destination}
              onChange={onDestinationChange}
              autoFocus={isExpanded && !!origin && !destination}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 transition-colors"
            disabled={!origin || !destination}
            onClick={() => {}}
          >
            <NavigationIcon className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JourneyPanel;
