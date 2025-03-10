
import React from "react";
import { Location } from "@/utils/locationUtils";
import LocationInput from "./LocationInput";

interface SearchBarProps {
  value: Location | null;
  onChange: (location: Location | null) => void;
  onSearch: () => void;
  isExpanded: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  isExpanded,
}) => {
  const handleLocationSelect = (location: Location | null) => {
    onChange(location);
    if (location) {
      onSearch();
    }
  };
  
  return (
    <div
      className={`
        w-full max-w-xl glass-panel rounded-xl overflow-hidden transition-all duration-500 ease-in-out
        ${isExpanded ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100 translate-y-0'}
      `}
    >
      <div className="p-1">
        <LocationInput
          placeholder="Search for a location..."
          value={value}
          onChange={handleLocationSelect}
          autoFocus
        />
      </div>
    </div>
  );
};

export default SearchBar;
