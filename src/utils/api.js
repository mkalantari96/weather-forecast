import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHERBIT_API_KEY;
const BASE_URL = "https://api.weatherbit.io/v2.0";

// Create axios instance with common configuration
const weatherAPI = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export const getCurrentWeather = async (lat, lon) => {
  try {
    const response = await weatherAPI.get("/current", {
      params: {
        lat,
        lon,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Current weather error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch current weather data");
  }
};

export const getForecast = async (lat, lon) => {
  try {
    const response = await weatherAPI.get("/forecast/daily", {
      params: {
        lat,
        lon,
        days: 7,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Forecast error:", error.response?.data || error.message);
    throw new Error("Failed to fetch forecast data");
  }
};

export const searchForecast = async (query) => {
  try {
    const response = await weatherAPI.get("/current", {
      params: {
        city: query,
        key: API_KEY,
      },
    });

    const data = response.data.data.map((item) => ({
      lat: item.lat,
      lon: item.lon,
      city_name: item.city_name,
      country_code: item.country_code,
    }));
    return data;
  } catch (error) {
    console.error(
      "Location search error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to search location");
  }
};

export const getHistoricalData = async (location, startDate, endDate) => {
  try {
    const response = await weatherAPI.get("/history/daily", {
      params: {
        lat: location.lat,
        lon: location.lon,
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Historical data error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch historical data");
  }
};

export const getAlertData = async (location) => {
  try {
    const response = await weatherAPI.get("/alerts", {
      params: {
        lat: location.lat,
        lon: location.lon,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Alert data error:", error.response?.data || error.message);
    throw new Error("Failed to fetch weather alerts");
  }
};
