import React, { useState, useEffect } from "react";
import { getForecast } from "../utils/api";
import moment from "moment";
import { getWeatherEmoji, getWeatherGradient } from "../utils/helpers";

const ForecastWeek = ({ location, unit, theme }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const data = await getForecast(location.lat, location.lon);
      setForecast(data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch forecast data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [location]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchForecast();
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

  if (!forecast)
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
          No Forecast Data Available
        </h3>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          We're unable to load the weather forecast at this time. Please try
          again later.
        </p>
      </div>
    );

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${
        theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
      } backdrop-blur-sm shadow-lg transition-all duration-300`}
    >
      <div className="flex justify-between items-center p-6 border-b border-gray-200/20">
        <h2 className="text-2xl font-bold">7-Day Forecast</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {forecast.slice(0, 7).map((day, index) => (
            <div
              key={day.datetime}
              className={`${
                theme === "dark" ? "bg-gray-700/50" : "bg-gray-100/50"
              } backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:transform hover:scale-105 ${
                index === 0 ? "border-2 border-blue-500/50" : ""
              }`}
            >
              {/* Date */}
              <div className="text-center mb-3">
                <p className="font-semibold">
                  {moment(day.datetime).format("ddd")}
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {moment(day.datetime).format("MMM D")}
                </p>
              </div>

              {/* Weather Icon */}
              <div className="flex justify-center items-center my-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${getWeatherGradient(
                    day.weather.code
                  )}`}
                >
                  <span className="text-3xl">
                    {getWeatherEmoji(day.weather.code)}
                  </span>
                </div>
              </div>

              {/* Temperature */}
              <div className="text-center mb-3">
                <p className="text-2xl font-bold">
                  {Math.round(convertTemp(day.temp))}°{unit}
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {day.weather.description}
                </p>
              </div>

              {/* Details */}
              <div
                className={`text-sm space-y-2 pt-3 border-t ${
                  theme === "dark" ? "border-gray-600" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between">
                  <span
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    High
                  </span>
                  <span className="font-semibold">
                    {Math.round(convertTemp(day.max_temp))}°{unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Low
                  </span>
                  <span className="font-semibold">
                    {Math.round(convertTemp(day.min_temp))}°{unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Rain
                  </span>
                  <span className="font-semibold">{Math.round(day.pop)}%</span>
                </div>
              </div>
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

export default ForecastWeek;
