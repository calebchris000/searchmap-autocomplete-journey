
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Location } from "@/utils/locationUtils";
import { DEFAULT_CENTER, DEFAULT_ZOOM, addMarkerToMap, fitMapToMarkers } from "@/utils/mapUtils";
import SearchBar from "./SearchBar";
import JourneyPanel from "./JourneyPanel";

const SearchMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [searchLocation, setSearchLocation] = useState<Location | null>(null);
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [isJourneyMode, setIsJourneyMode] = useState(false);
  const markersRef = useRef<L.Marker[]>([]);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false, // We'll add it manually in a different position
    });
    
    // Add zoom control to the bottom right
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    
    mapRef.current = map;
    setIsMapInitialized(true);
    
    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  
  // Handle search location update
  useEffect(() => {
    if (!isMapInitialized || !mapRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    if (searchLocation) {
      // Add marker for the search location
      const marker = addMarkerToMap(mapRef.current, searchLocation, 'current');
      markersRef.current.push(marker);
      
      // Center map on the search location
      mapRef.current.setView(searchLocation.coordinates, 13);
      
      // When a location is searched, set it as origin
      setOrigin(searchLocation);
      setIsJourneyMode(true);
    } else {
      // If search is cleared, reset to default view
      mapRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  }, [searchLocation, isMapInitialized]);
  
  // Handle journey mode (origin and destination)
  useEffect(() => {
    if (!isMapInitialized || !mapRef.current || !isJourneyMode) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add markers for origin and destination
    if (origin) {
      const originMarker = addMarkerToMap(mapRef.current, origin, 'origin');
      markersRef.current.push(originMarker);
    }
    
    if (destination) {
      const destMarker = addMarkerToMap(mapRef.current, destination, 'destination');
      markersRef.current.push(destMarker);
    }
    
    // Fit map to show all markers
    if (markersRef.current.length > 0) {
      fitMapToMarkers(mapRef.current, markersRef.current);
    }
  }, [origin, destination, isJourneyMode, isMapInitialized]);
  
  const handleSearch = () => {
    setIsJourneyMode(true);
  };
  
  const handleBackToSearch = () => {
    setIsJourneyMode(false);
    setDestination(null);
  };
  
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainerRef} className="map-container" />
      
      {/* Search Overlay */}
      <div className="search-overlay">
        <SearchBar
          value={searchLocation}
          onChange={setSearchLocation}
          onSearch={handleSearch}
          isExpanded={isJourneyMode}
        />
        
        <JourneyPanel
          origin={origin}
          destination={destination}
          onOriginChange={setOrigin}
          onDestinationChange={setDestination}
          onBack={handleBackToSearch}
          isExpanded={isJourneyMode}
        />
      </div>
    </div>
  );
};

export default SearchMap;
