
// Sample location data (in a real app, this would come from an API)
export interface Location {
  id: string;
  name: string;
  fullAddress: string;
  coordinates: [number, number]; // [latitude, longitude]
}

const sampleLocations: Location[] = [
  {
    id: "1",
    name: "New York City",
    fullAddress: "New York, NY, USA",
    coordinates: [40.7128, -74.0060]
  },
  {
    id: "2",
    name: "Los Angeles",
    fullAddress: "Los Angeles, CA, USA",
    coordinates: [34.0522, -118.2437]
  },
  {
    id: "3",
    name: "Chicago",
    fullAddress: "Chicago, IL, USA",
    coordinates: [41.8781, -87.6298]
  },
  {
    id: "4",
    name: "San Francisco",
    fullAddress: "San Francisco, CA, USA",
    coordinates: [37.7749, -122.4194]
  },
  {
    id: "5",
    name: "Miami",
    fullAddress: "Miami, FL, USA",
    coordinates: [25.7617, -80.1918]
  },
  {
    id: "6",
    name: "Seattle",
    fullAddress: "Seattle, WA, USA",
    coordinates: [47.6062, -122.3321]
  },
  {
    id: "7",
    name: "Boston",
    fullAddress: "Boston, MA, USA",
    coordinates: [42.3601, -71.0589]
  },
  {
    id: "8",
    name: "Denver",
    fullAddress: "Denver, CO, USA",
    coordinates: [39.7392, -104.9903]
  },
  {
    id: "9",
    name: "Austin",
    fullAddress: "Austin, TX, USA",
    coordinates: [30.2672, -97.7431]
  },
  {
    id: "10",
    name: "Nashville",
    fullAddress: "Nashville, TN, USA",
    coordinates: [36.1627, -86.7816]
  },
];

// Search through locations based on search query
export const searchLocations = (query: string): Location[] => {
  if (!query || query.trim() === "") return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return sampleLocations.filter(
    location => 
      location.name.toLowerCase().includes(normalizedQuery) || 
      location.fullAddress.toLowerCase().includes(normalizedQuery)
  );
};

// Get location by ID
export const getLocationById = (id: string): Location | undefined => {
  return sampleLocations.find(location => location.id === id);
};
