import React, { useState } from "react";
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
  const [inputValue, setInputValue] = useState("");

  const handleInputValue = (value: string) => {
    setInputValue(value);
  };

  const handleLocationSelect = (location: Location | null) => {
    onChange(location);
    if (location) {
      onSearch();
    }
  };

  return (
    <div
      className={`
        w-full max-w-xl  bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-3 rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out
        ${isExpanded ? "opacity-0 translate-y-[-20px] pointer-events-none " : "opacity-100 translate-y-0"}
        ${inputValue.length ? "h-80" : "h-auto"}
      `}
    >
      <div className="p-1">
        <LocationInput
          onValue={handleInputValue}
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
