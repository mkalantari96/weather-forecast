import "./App.css";
import React, { useState, useEffect } from "react";
import CurrentWeather from "./components/CurrentWeather";
import ForecastWeek from "./components/ForecastWeek";
import WeatherAlert from "./components/WeatherAlert";
import ShowHistoricalData from "./components/ShowHistoricalData";
import SearchLocationModal from "./components/SearchLocationModal";

function App() {
  const [unit, setUnit] = useState("C");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("current");
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const tabs = [
    {
      id: "current",
      label: "Current Weather",
      icon: "☀️",
      description: "Real-time weather updates",
      gradient: "from-orange-400 to-yellow-300",
    },
    {
      id: "forecast",
      label: "7-Day Forecast",
      icon: "📅",
      description: "Weekly weather outlook",
      gradient: "from-blue-400 to-cyan-300",
    },
    {
      id: "historical",
      label: "Historical Data",
      icon: "📊",
      description: "Past weather trends",
      gradient: "from-purple-400 to-pink-300",
    },
  ];

  const requestLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Unable to access your location. Please enable location services in your browser settings for accurate weather data. Currently showing weather for Tehran, Iran (35.7219° N, 51.3347° E)"
          );
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    requestLocation();
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  if (!location && !isLoading) {
    setLocation({
      lat: 35.7219,
      lon: 51.3347,
    });
  }

  const searchButton = (
    <button
      onClick={() => setIsSearchModalOpen(true)}
      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 ${
        theme === "dark"
          ? "bg-gray-700 hover:bg-gray-600"
          : "bg-white hover:bg-gray-100"
      } shadow-lg hover:shadow-xl`}
    >
      <svg
        className="w-5 h-5"
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
      <span>Search Location (Map or City Name)</span>
    </button>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <header className="text-center mb-12 space-y-6">
          <div className="relative inline-block">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400 animate-gradient pb-2">
              Weather Dashboard
            </h1>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400 rounded-full animate-gradient"></div>
          </div>

          <p
            className={`text-lg max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Your comprehensive weather companion with real-time updates,
            forecasts, and historical data
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => setUnit(unit === "C" ? "F" : "C")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-50"
              } shadow-lg hover:shadow-xl`}
            >
              <span>🌡️</span>
              Switch to °{unit === "C" ? "F" : "C"}
            </button>

            <button
              onClick={requestLocation}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>📍</span>
              Use My Location
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-50"
              } shadow-lg hover:shadow-xl`}
            >
              {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>

            {searchButton}
          </div>
        </header>

        {error && (
          <div
            className={`${
              theme === "dark"
                ? "bg-red-900/50 text-white"
                : "bg-red-100 text-red-700"
            } border border-red-400  px-4 py-3 rounded-lg mb-4`}
          >
            {error}
          </div>
        )}

        {/* Main Content */}
        <div
          className={`${
            theme === "dark" ? "bg-gray-800/50" : "bg-white/80"
          } backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transition-all duration-300`}
        >
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto border-b border-gray-200/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center px-8 py-6 text-sm font-medium transition-all duration-300 relative group hover:bg-white/5 ${
                  activeTab === tab.id
                    ? "text-blue-400"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center bg-gradient-to-br ${tab.gradient} transform group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-2xl">{tab.icon}</span>
                </div>
                <span className="font-semibold">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400" />
                )}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl">
                  {tab.description}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent"></div>
                <p
                  className={
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Loading weather data...
                </p>
              </div>
            ) : (
              <>
                {activeTab === "current" && location && (
                  <CurrentWeather
                    location={location}
                    unit={unit}
                    theme={theme}
                  />
                )}
                {activeTab === "forecast" && location && (
                  <ForecastWeek location={location} unit={unit} theme={theme} />
                )}
                {activeTab === "historical" && location && (
                  <ShowHistoricalData
                    location={location}
                    unit={unit}
                    theme={theme}
                  />
                )}
              </>
            )}
          </div>
        </div>
        <WeatherAlert location={location} theme={theme} />
        <SearchLocationModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          setLocation={setLocation}
          location={location}
          theme={theme}
        />
      </div>
    </div>
  );
}

export default App;
