import React, { useState, useEffect } from "react";
import { getCurrentWeather } from "../utils/api";
import moment from "moment";
import { getWeatherEmoji } from "../utils/helpers";

const CurrentWeather = ({ location, unit, theme }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const data = await getCurrentWeather(location.lat, location.lon);
      setWeather(data.data[0]);
      setError(null);
    } catch (err) {
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [location]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchWeather();
  };

  const convertTemp = (temp) => {
    return unit === "F" ? (temp * 9) / 5 + 32 : temp;
  };

  if (loading && !isRefreshing)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (error)
    return (
      <div
        className={`${
          theme === "dark" ? "bg-red-900/50" : "bg-red-100"
        } border border-red-400 text-red-700 px-4 py-3 rounded-lg`}
      >
        {error}
      </div>
    );

  if (!weather)
    return (
      <div
        className={`p-6 text-center rounded-lg ${
          theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
        } backdrop-blur-sm shadow-lg`}
      >
        <div className="mb-4">
          <span className="text-6xl">🌤️</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">
          No Weather Data Available
        </h3>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          We're unable to load the current weather conditions at this time.
          Please try again later.
        </p>
      </div>
    );

  const weatherConditions = [
    {
      label: "Feels Like",
      value: `${Math.round(convertTemp(weather.app_temp))}°${unit}`,
      icon: "🌡️",
      gradient: "from-orange-400 to-red-400",
    },
    {
      label: "Humidity",
      value: `${weather.rh}%`,
      icon: "💧",
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      label: "Wind Speed",
      value: `${weather.wind_spd.toFixed(1)} m/s`,
      icon: "🌪️",
      gradient: "from-green-400 to-emerald-400",
    },
    {
      label: "UV Index",
      value: weather.uv.toFixed(1),
      icon: "☀️",
      gradient: "from-yellow-400 to-amber-400",
    },
    {
      label: "Pressure",
      value: `${weather.pres.toFixed(0)} mb`,
      icon: "📊",
      gradient: "from-purple-400 to-pink-400",
    },
    {
      label: "Visibility",
      value: `${weather.vis.toFixed(1)} km`,
      icon: "👁️",
      gradient: "from-indigo-400 to-violet-400",
    },
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${
        theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
      } backdrop-blur-sm shadow-lg transition-all duration-300`}
    >
      {/* Header with refresh button */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200/20">
        <h2 className="text-2xl font-bold">Current Weather</h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <svg
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="p-6">
        {/* Main weather info */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p
              className={`text-sm mb-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {moment(weather.ob_time).format("MMMM Do YYYY, h:mm a")}
            </p>
            <div className="flex items-center gap-4">
              <h1 className="text-6xl font-bold">
                {Math.round(convertTemp(weather.temp))}°{unit}
              </h1>
              <div
                className={`px-4 py-2 rounded-full text-sm ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                {weather.weather.description}
              </div>
            </div>
          </div>
          <div
            className={`text-8xl ${
              theme === "dark" ? "text-white/80" : "text-gray-800/80"
            }`}
          >
            {getWeatherEmoji(weather.weather.code)}
          </div>
        </div>

        {/* Weather conditions grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {weatherConditions.map((condition, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl ${
                theme === "dark" ? "bg-gray-700/50" : "bg-gray-100/50"
              } backdrop-blur-sm transition-all duration-300 hover:transform hover:scale-105`}
            >
              <div
                className={`w-10 h-10 rounded-full mb-3 flex items-center justify-center bg-gradient-to-br ${condition.gradient}`}
              >
                <span className="text-xl">{condition.icon}</span>
              </div>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {condition.label}
              </p>
              <p className="text-xl font-semibold mt-1">{condition.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh overlay */}
      {isRefreshing && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default CurrentWeather;
