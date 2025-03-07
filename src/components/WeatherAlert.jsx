import React, { useState, useEffect } from "react";
import { getAlertData } from "../utils/api";
import moment from "moment";
import { getSeverityStyles } from "../utils/helpers";

const WeatherAlert = ({ location, theme }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      const response = await getAlertData(location);
      setAlerts(response.alerts || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch weather alerts");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchAlerts();
      const interval = setInterval(fetchAlerts, 15 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [location]);

  if (loading && !isRefreshing) {
    return (
      <div
        className={`rounded-2xl ${
          theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
        } backdrop-blur-sm shadow-lg p-6`}
      >
        <div className="space-y-4">
          <div className="animate-pulse flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-48 bg-gray-300 rounded"></div>
          </div>
          <div className="animate-pulse space-y-2">
            <div className="h-3 w-full bg-gray-300 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`rounded-2xl ${
          theme === "dark" ? "bg-red-900/50" : "bg-red-100"
        } border border-red-400 p-6`}
      >
        <div className="flex items-center gap-3">
          <svg
            className="h-6 w-6 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className={theme === "dark" ? "text-red-100" : "text-red-800"}>
            {error}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl my-2 ${
        theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
      } backdrop-blur-sm shadow-lg transition-all duration-300`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Weather Alerts</h2>
          <button
            onClick={fetchAlerts}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
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

        {alerts.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center py-8 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <svg
              className="w-16 h-16 mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-medium mb-1">No Active Alerts</p>
            <p className="text-sm opacity-75">
              The weather conditions are currently stable
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => {
              const styles = getSeverityStyles(alert.severity);
              return (
                <div
                  key={index}
                  className={`${styles.bg} border ${styles.border} rounded-xl p-4 transition-all duration-300 hover:transform hover:scale-[1.01]`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className={`h-5 w-5 ${styles.icon}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${styles.text}`}>
                          {alert.title}
                        </h3>
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-full ${styles.bg} ${styles.text}`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className={`text-sm ${styles.text} opacity-90 mb-2`}>
                        {alert.description}
                      </p>
                      {alert.expires_at && (
                        <p className={`text-sm ${styles.text} opacity-75`}>
                          Expires: {moment(alert.expires_at).fromNow()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherAlert;
