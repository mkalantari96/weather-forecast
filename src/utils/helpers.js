export const getWeatherGradient = (code) => {
  if (code >= 200 && code < 300) return "from-gray-400 to-blue-400"; // thunderstorm
  if (code >= 300 && code < 400) return "from-blue-300 to-blue-400"; // drizzle
  if (code >= 500 && code < 600) return "from-blue-400 to-blue-500"; // rain
  if (code >= 600 && code < 700) return "from-blue-100 to-blue-200"; // snow
  if (code >= 700 && code < 800) return "from-gray-300 to-gray-400"; // atmosphere
  if (code === 800) return "from-yellow-400 to-orange-400"; // clear
  if (code > 800) return "from-gray-300 to-blue-300"; // clouds
  return "from-gray-400 to-gray-500"; // default
};

export const getSeverityStyles = (severity) => {
  const styles = {
    Warning: {
      bg: theme === "dark" ? "bg-red-900/50" : "bg-red-100",
      border: theme === "dark" ? "border-red-700" : "border-red-200",
      text: theme === "dark" ? "text-red-100" : "text-red-800",
      icon: "text-red-400",
    },
    Watch: {
      bg: theme === "dark" ? "bg-yellow-900/50" : "bg-yellow-100",
      border: theme === "dark" ? "border-yellow-700" : "border-yellow-200",
      text: theme === "dark" ? "text-yellow-100" : "text-yellow-800",
      icon: "text-yellow-400",
    },
    Advisory: {
      bg: theme === "dark" ? "bg-blue-900/50" : "bg-blue-100",
      border: theme === "dark" ? "border-blue-700" : "border-blue-200",
      text: theme === "dark" ? "text-blue-100" : "text-blue-800",
      icon: "text-blue-400",
    },
  };
  return styles[severity] || styles.Advisory;
};

export const getWeatherEmoji = (code) => {
  const weatherEmojis = {
    200: "⛈️", // thunderstorm
    300: "🌧️", // drizzle
    500: "🌧️", // rain
    600: "🌨️", // snow
    700: "🌫️", // atmosphere
    800: "☀️", // clear
    801: "🌤️", // few clouds
    802: "⛅", // scattered clouds
    803: "🌥️", // broken clouds
    804: "☁️", // overcast clouds
  };

  const codes = Object.keys(weatherEmojis).map(Number);
  const closest = codes.reduce((prev, curr) => {
    return Math.abs(curr - code) < Math.abs(prev - code) ? curr : prev;
  });

  return weatherEmojis[closest] || "🌡️";
};
