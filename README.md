# Weather Dashboard 🌦️

A modern, responsive weather application built with React.js that provides real-time weather data, forecasts, historical data, and weather alerts. Built with modern web technologies and a focus on user experience.

## 📸 Screenshots

![Main Tab Weather Dashboard](/weather-forecast/picOfApp/MainTabPic.png)
_Main Dashboard with Current Weather and Alerts_

![Forecast Tab Weather Dashboard](/weather-forecast/picOfApp/ForeCastTabPic.png)
_7-Day Weather Forecast View_

![Historical Data Tab Weather Dashboard](/weather-forecast/picOfApp/HistoricalDataTabPic.png)
_Historical Weather Data with Interactive Charts_

![Search and Map Weather Dashboard](/weather-forecast/picOfApp/SearchLocationPic.png)
_Location Search with Interactive Map_

## 🌟 Features

### Core Features

- **Real-time Weather Data**: Live weather conditions with comprehensive metrics
- **7-Day Forecast**: Detailed weekly weather predictions
- **Historical Weather Data**: Interactive temperature trend analysis
- **Weather Alerts**: Critical weather warnings and advisories

### User Interface

- **Interactive Map**: Visual location selection with Leaflet integration
- **Dark/Light Theme**: Automatic and manual theme switching with smooth transitions
- **Responsive Design**: Optimized for all device sizes
- **Glassmorphism UI**: Modern, depth-enhanced interface elements

### Functionality

- **Multiple Units**: Toggle between Celsius and Fahrenheit
- **Geolocation**: Automatic user location detection
- **Search Functionality**: City-based weather data search
- **Data Visualization**: Interactive charts for historical data
- **Real-time Updates**: Automatic data refresh capabilities

## 🚀 Technologies Used

### Frontend

- React.js 19.0.0
- Tailwind CSS 4.0.12
- Recharts 2.15.1

### Build Tools & Development

- Vite 6.2.0
- ESLint 9.21.0

### Maps & Data

- Leaflet/React-Leaflet 5.0.0
- WeatherBit API Integration

### Utilities

- Axios 1.8.2
- Moment.js 2.30.1

## 📦 Installation

1. Clone the repository:
   bash
   git clone https://github.com/mkalantari96/weather-forecast.git
2. Install dependencies:
   bash
   cd weather-forecast
   npm install
3. Create a `.env` file in the root directory and add your WeatherBit API key:
   env
   VITE_WEATHERBIT_API_KEY=your_api_key_here
4. Start the development server:
   bash
   npm run dev

## 🔧 Configuration

### API Keys

The application uses the WeatherBit API. You'll need to:

1. Sign up at [WeatherBit](https://www.weatherbit.io/)
2. Get your API key
3. Add it to your `.env` file

### Environment Variables

env
VITE_WEATHERBIT_API_KEY=your_api_key_here

### Available Scripts

bash
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build
npm run lint # Run ESLint

## 🎨 Design Philosophy

### UI/UX Principles

- **Intuitive Navigation**: Tab-based interface for easy access
- **Visual Hierarchy**: Clear organization of weather information
- **Responsive Feedback**: Loading states and error handling
- **Accessibility**: WCAG compliance considerations
- **Glassmorphism**: Used for modern, depth-enhanced UI elements
- **Gradient Animations**: Smooth transitions for better user engagement
- **Interactive Elements**: Hover effects and smooth transitions
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Dark/Light Theme**: Automatic system preference detection with manual override

### Technical Architecture

- **Component Structure**: Modular components for better maintainability
- **API Layer**: Centralized API handling with error management
- **State Management**: React hooks for local state management
- **Error Handling**: Comprehensive error handling with user feedback

### Key Components

- `CurrentWeather`: Real-time weather display
- `ForecastWeek`: Weekly forecast visualization
- `ShowHistoricalData`: Historical data charts
- `WeatherAlert`: Weather warnings system
- `SearchLocationModal`: Location search interface

### Data Flow

API Request → Data Processing → State Management → UI Rendering

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔄 Updates and Maintenance

To update dependencies:
bash
npm update

## 🐛 Known Issues

- Historical data might be limited based on API plan
- Map tiles might load slowly on slower connections
- Some weather alerts might not be available in all regions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👏 Acknowledgments

- WeatherBit API for weather data
- OpenStreetMap for map tiles
- React and Vite communities
- TailwindCSS team

Made with ❤️ by Mohammadreza Kalantari
