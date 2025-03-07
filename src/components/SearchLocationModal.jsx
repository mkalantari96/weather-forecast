import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { searchForecast } from "../utils/api";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("/leaflet/images/marker-icon-2x.png", import.meta.url)
    .href,
  iconUrl: new URL("/leaflet/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("/leaflet/images/marker-shadow.png", import.meta.url).href,
});
const MapEvents = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lon: lng });
    },
  });
  return null;
};

const SearchLocationModal = ({
  isOpen,
  onClose,
  setLocation,
  location,
  theme,
}) => {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [mapCenter, setMapCenter] = useState([
    location?.lat || 51.505,
    location?.lon || -0.09,
  ]);
  const [markerPosition, setMarkerPosition] = useState(
    location ? [location.lat, location.lon] : null
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setError(null);

    try {
      const response = await searchForecast(query);
      if (response.length > 0) {
        const { lat, lon, city_name, country_code } = response[0];
        handleLocationSelect({
          lat,
          lon,
        });
        addToSearchHistory({ lat, lon, name: `${city_name}, ${country_code}` });
        setQuery("");
      } else {
        setError("Location not found");
      }
    } catch (err) {
      setError("Failed to search location");
    } finally {
      setSearching(false);
    }
  };

  const handleLocationSelect = ({ lat, lon }) => {
    setLocation({ lat, lon });
    setMarkerPosition([lat, lon]);
    setMapCenter([lat, lon]);
  };

  const addToSearchHistory = (location) => {
    setSearchHistory((prev) => {
      const newHistory = [
        location,
        ...prev.filter((item) => item.name !== location.name),
      ];
      return newHistory.slice(0, 5);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          className={`relative w-full max-w-4xl rounded-2xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-2xl`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute right-4 top-4 p-2 rounded-full ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } transition-colors duration-200`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Search Location</h2>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a city..."
                  className={`w-full px-6 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gray-700/50 text-white placeholder-gray-400"
                      : "bg-gray-100 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                >
                  {searching ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {error && (
                <div className="absolute -bottom-6 left-0 text-sm text-red-500">
                  {error}
                </div>
              )}
            </form>

            {searchHistory.length > 0 && (
              <div className="mb-6">
                <h3
                  className={`text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleLocationSelect(item)}
                      className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="h-[400px] rounded-xl overflow-hidden">
              <MapContainer
                center={mapCenter}
                zoom={13}
                className="h-full w-full"
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url={
                    theme === "dark"
                      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  }
                />
                <MapEvents onLocationSelect={handleLocationSelect} />
                {markerPosition && <Marker position={markerPosition} />}
              </MapContainer>
            </div>

            <div
              className={`mt-4 px-4 py-3 rounded-lg ${
                theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className="h-6 w-6 text-blue-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Click anywhere on the map to select a location, or use the
                  search bar above to find a specific place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchLocationModal;
