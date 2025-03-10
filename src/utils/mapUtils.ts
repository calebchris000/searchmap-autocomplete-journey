
import L from 'leaflet';
import { Location } from './locationUtils';

// Default map center coordinates (USA center)
export const DEFAULT_CENTER: [number, number] = [39.8283, -98.5795];
export const DEFAULT_ZOOM = 4;

// Create a custom marker icon
export const createMarkerIcon = (type: 'origin' | 'destination' | 'current') => {
  const color = type === 'origin' ? '#3b82f6' : 
               type === 'destination' ? '#ef4444' : 
               '#10b981';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px; 
        height: 24px; 
        background-color: ${color}; 
        border-radius: 50%; 
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Add markers to the map
export const addMarkerToMap = (
  map: L.Map,
  location: Location,
  type: 'origin' | 'destination' | 'current'
): L.Marker => {
  const marker = L.marker(location.coordinates, {
    icon: createMarkerIcon(type),
  }).addTo(map);
  
  marker.bindTooltip(location.name, {
    permanent: false,
    direction: 'top',
    className: 'custom-tooltip',
  });
  
  return marker;
};

// Fit map bounds to display both origin and destination
export const fitMapToMarkers = (
  map: L.Map,
  markers: L.Marker[]
): void => {
  if (markers.length === 0) return;
  
  if (markers.length === 1) {
    map.setView(markers[0].getLatLng(), 13);
    return;
  }
  
  const group = L.featureGroup(markers);
  map.fitBounds(group.getBounds().pad(0.2)); // Adding 20% padding
};
