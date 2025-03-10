
import React, { useState, useEffect, useRef } from "react";
import { SearchIcon, XIcon, MapPinIcon } from "lucide-react";
import { Location, searchLocations } from "@/utils/locationUtils";

interface LocationInputProps {
  placeholder: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
  onFocus?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  placeholder,
  value,
  onChange,
  onFocus,
  disabled = false,
  autoFocus = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Update searchTerm when value changes externally
  useEffect(() => {
    if (value) {
      setSearchTerm(value.name);
    }
  }, [value]);
  
  // Handle search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }
    
    // Search for locations
    const results = searchLocations(searchTerm);
    setSuggestions(results);
  }, [searchTerm]);
  
  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "" && value) {
      onChange(null);
    }
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };
  
  const handleBlur = () => {
    // Delay blur to allow click on suggestion
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };
  
  const handleSelectLocation = (location: Location) => {
    setSearchTerm(location.name);
    setSuggestions([]);
    onChange(location);
  };
  
  const clearInput = () => {
    setSearchTerm("");
    setSuggestions([]);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="location-input pr-10 pl-10"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          autoComplete="off"
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <SearchIcon className="h-4 w-4 text-gray-400" />
        </div>
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            onClick={clearInput}
            type="button"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {isFocused && suggestions.length > 0 && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-900 shadow-xl rounded-xl overflow-hidden z-50 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm animate-fade-in">
          <ul className="py-2 px-1 max-h-64 overflow-y-auto">
            {suggestions.map((location) => (
              <li key={location.id}>
                <button
                  type="button"
                  className="location-suggestion w-full text-left"
                  onClick={() => handleSelectLocation(location)}
                >
                  <MapPinIcon className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{location.fullAddress}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationInput;
