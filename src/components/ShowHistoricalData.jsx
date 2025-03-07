import React, { useState, useEffect } from "react";
import moment from "moment";
import { getHistoricalData } from "../utils/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ShowHistoricalData = ({ location, unit, theme }) => {
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("7"); // days

  const timeRanges = [
    { value: "7", label: "7 Days" },
    { value: "14", label: "14 Days" },
    { value: "30", label: "30 Days" },
  ];

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      const endDate = moment().format("YYYY-MM-DD");
      const startDate = moment()
        .subtract(selectedTimeRange, "days")
        .format("YYYY-MM-DD");

      const response = await getHistoricalData(location, startDate, endDate);
      setHistoricalData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch historical data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchHistoricalData();
    }
  }, [location, selectedTimeRange]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchHistoricalData();
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

  if (!historicalData)
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
          We're unable to load the historical data of weather conditions at this
          time. Please try again later.
        </p>
      </div>
    );

  const chartData = historicalData.map((day) => ({
    date: moment(day.datetime).format("MMM D"),
    "Max Temp": Math.round(convertTemp(day.max_temp)),
    "Min Temp": Math.round(convertTemp(day.min_temp)),
    "Avg Temp": Math.round(convertTemp(day.temp)),
  }));

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${
        theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
      } backdrop-blur-sm shadow-lg transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200/20">
        <div>
          <h2 className="text-2xl font-bold mb-1">Historical Weather</h2>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Temperature trends over time
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Time range selector */}
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Range:
            </span>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className={`px-3 py-1 rounded-lg text-sm ${
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-200"
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          {/* Refresh button */}
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
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-[400px] mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
              />
              <XAxis
                dataKey="date"
                stroke={theme === "dark" ? "#9CA3AF" : "#4B5563"}
              />
              <YAxis
                stroke={theme === "dark" ? "#9CA3AF" : "#4B5563"}
                label={{
                  value: `Temperature (°${unit})`,
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: theme === "dark" ? "#9CA3AF" : "#4B5563" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  border: "none",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Max Temp"
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Min Temp"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Avg Temp"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead
              className={theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"}
            >
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Max Temp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Min Temp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Avg Temp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Precipitation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historicalData.map((day) => (
                <tr
                  key={day.datetime}
                  className={`${
                    theme === "dark"
                      ? "hover:bg-gray-700/50"
                      : "hover:bg-gray-50"
                  } transition-colors duration-150`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {moment(day.datetime).format("MMM D, YYYY")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Math.round(convertTemp(day.max_temp))}°{unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Math.round(convertTemp(day.min_temp))}°{unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Math.round(convertTemp(day.temp))}°{unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {day.precip.toFixed(1)} mm
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default ShowHistoricalData;
