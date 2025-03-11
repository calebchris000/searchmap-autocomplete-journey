import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Coordinate, Location } from "@/utils/locationUtils";
import polyline from "@mapbox/polyline";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  addMarkerToMap,
  fitMapToMarkers,
} from "@/utils/mapUtils";
import SearchBar from "./SearchBar";
import JourneyPanel from "./JourneyPanel";
import { GetDirections } from "@/services/location.services";

const SearchMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [searchLocation, setSearchLocation] = useState<Location | null>(null);
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [isJourneyMode, setIsJourneyMode] = useState(false);
  const [routeGeometry, setRouteGeometry] = useState<string | null>(null);
  const [getDirectionStatus, setGetDirectionStatus] = useState<
    "not-set" | "pending" | "success" | "failed"
  >("not-set");
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    setIsMapInitialized(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isMapInitialized || !mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (searchLocation) {
      const marker = addMarkerToMap(mapRef.current, searchLocation, "current");
      markersRef.current.push(marker);

      mapRef.current.setView(searchLocation.coordinates, 13);

      setOrigin(searchLocation);
      setIsJourneyMode(true);
    } else {
      mapRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  }, [searchLocation, isMapInitialized]);

  useEffect(() => {
    if (!isMapInitialized || !mapRef.current || !isJourneyMode) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (origin) {
      const originMarker = addMarkerToMap(mapRef.current, origin, "origin");
      markersRef.current.push(originMarker);
    }

    if (destination) {
      const destMarker = addMarkerToMap(
        mapRef.current,
        destination,
        "destination",
      );
      markersRef.current.push(destMarker);
    }

    if (markersRef.current.length > 0) {
      fitMapToMarkers(mapRef.current, markersRef.current);
    }
  }, [origin, destination, isJourneyMode, isMapInitialized]);

  useEffect(() => {
    if (!isMapInitialized || !mapRef.current || !routeGeometry) return;
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
    try {
      const decoded = polyline.decode(routeGeometry);
      const routePolyline = L.polyline(
        decoded.map((coord) => [coord[0], coord[1]]),
        {
          color: "#0066FF",
          weight: 5,
          opacity: 0.7,
          lineJoin: "round",
        },
      );

      routePolyline.addTo(mapRef.current);

      routePolylineRef.current = routePolyline;

      mapRef.current.fitBounds(routePolyline.getBounds(), {
        padding: [50, 50],
      });
    } catch (error) {
      console.error("Error drawing route:", error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
    };
  }, [routeGeometry, isMapInitialized]);

  const handleSearch = () => {
    setIsJourneyMode(true);
  };

  const handleBackToSearch = () => {
    setIsJourneyMode(false);
    setDestination(null);
  };

  const handleGetDirections = async () => {
    setGetDirectionStatus("pending");
    const _origin: Coordinate = {
      lat: origin.coordinates[0],
      lon: origin.coordinates[1],
    };
    const _destination: Coordinate = {
      lat: destination.coordinates[0],
      lon: destination.coordinates[1],
    };

    const response = await GetDirections(_origin, _destination);
    if (response.success) {
      setGetDirectionStatus("success");
      setRouteGeometry(response.data.routes[0].geometry);
    } else {
      // setGetDirectionStatus("failed");
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div ref={mapContainerRef} className="h-full w-full" />

      <div
        className={`absolute top-4 left-0 right-0 z-10 mx-auto px-4 max-w-xl
          `}
      >
        <SearchBar
          value={searchLocation}
          onChange={setSearchLocation}
          onSearch={handleSearch}
          isExpanded={isJourneyMode}
        />

        <JourneyPanel
          origin={origin}
          getDirectionStatus={getDirectionStatus}
          onGetDirections={handleGetDirections}
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
