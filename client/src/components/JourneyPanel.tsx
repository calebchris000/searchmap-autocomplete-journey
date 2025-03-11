import React, { useEffect } from "react";
import { Coordinate, Location } from "@/utils/locationUtils";
import LocationInput from "./LocationInput";
import { ArrowLeftIcon, NavigationIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JourneyPanelProps {
  origin: Location | null;
  destination: Location | null;
  onOriginChange: (location: Location | null) => void;
  onDestinationChange: (location: Location | null) => void;
  onBack: () => void;
  onGetDirections: VoidFunction;
  getDirectionStatus: "success" | "pending" | "failed" | "not-set";
  isExpanded: boolean;
}

const JourneyPanel: React.FC<JourneyPanelProps> = ({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onBack,
  onGetDirections,
  getDirectionStatus = "not-set",
  isExpanded,
}) => {
  console.log(isExpanded);
  useEffect(() => {
    if (!isExpanded) {
      onDestinationChange(null);
    }
  }, [isExpanded, onDestinationChange]);

  const handleGetDirections = () => {
    onGetDirections();
  };

  return (
    <div
      className={`
        w-full max-w-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-3 rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out
        ${isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-20px] pointer-events-none"} `}
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
              onValue={() => {}}
              onChange={onOriginChange}
              autoFocus={isExpanded && !origin}
            />
          </div>

          <div className="relative">
            <LocationInput
              placeholder="To"
              onValue={() => {}}
              value={destination}
              onChange={onDestinationChange}
              autoFocus={isExpanded && !!origin && !destination}
            />
          </div>
        </div>

        <div className="mt-4">
          <Button
            className={`w-full transition-colors ${
              getDirectionStatus === "pending"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
            }`}
            disabled={
              !origin || !destination || getDirectionStatus === "pending"
            }
            onClick={handleGetDirections}
          >
            {getDirectionStatus === "pending" ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Getting Directions
              </>
            ) : (
              <>
                <NavigationIcon className="h-4 w-4 mr-2" />
                Get Directions
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JourneyPanel;
