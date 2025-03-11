import React, { useState, useEffect, useRef, useCallback } from "react";
import { SearchIcon, XIcon, MapPinIcon } from "lucide-react";
import { Location, searchLocations } from "@/utils/locationUtils";
import { GetSearch } from "@/services/location.services";
import { debounce } from "@/utils/inputUtiils";

interface LocationInputProps {
  placeholder: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
  onFocus?: () => void;
  onValue?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  placeholder,
  value,
  onChange,
  onFocus,
  onValue,
  disabled = false,
  autoFocus = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getSuggestions() {
      setLocationLoaded(false);
      if (!searchValue.length) return;
      const response = await GetSearch(searchValue);
      if (response.success) {
        console.log(response.data);
        setLocations(response.data as Location[]);
        setLocationLoaded(true);
      }
    }
    getSuggestions();
  }, [searchValue]);

  useEffect(() => {
    if (value) {
      setSearchTerm(value.name);
    }
  }, [value]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const debouncer = useCallback(
    debounce((v: string) => {
      onValue(v);
      setSearchValue(v);
    }),
    [],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncer(e.target.value);
    if (e.target.value === "" && value) {
      onChange(null);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
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
          className="w-full py-2 pl-10 pr-10 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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

      {isFocused && !locationLoaded && searchValue && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              Searching...
            </span>
          </div>
        </div>
      )}

      {isFocused && locationLoaded && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          <ul className="max-h-60 overflow-y-auto py-1">
            {locations.map((location) => (
              <li key={location.id}>
                <button
                  type="button"
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSelectLocation(location)}
                >
                  <MapPinIcon className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{location.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {location.fullAddress}
                    </span>
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
