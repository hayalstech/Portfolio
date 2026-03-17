"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Droplets,
  Eye,
  Gauge,
  Search,
  MapPin,
  Thermometer,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock
} from "lucide-react";

interface WeatherData {
  city: string;
  coordinates: { lat: number; lon: number };
  timezone: string;
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
  };
  forecast: Array<{
    date: string;
    dayOfWeek: string;
    high: number;
    low: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  }>;
  hourly: Array<{
    hour: number;
    temp: number;
    condition: string;
  }>;
  timestamp: string;
}

interface WeatherResponse {
  success: boolean;
  data: WeatherData;
  cached: boolean;
  processed: boolean;
}

const WEATHER_ICONS: Record<string, any> = {
  "Clear sky": Sun,
  "Partly cloudy": Cloud,
  "Cloudy": Cloud,
  "Light rain": CloudRain,
  "Moderate rain": CloudRain,
  "Heavy rain": CloudRain,
  "Thunderstorm": CloudRain,
  "Snow": CloudSnow,
};

const POPULAR_CITIES = [
  "Addis Ababa",
  "New York", 
  "London",
  "Tokyo",
  "Paris",
  "Sydney"
];

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("Addis Ababa");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch weather data
  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}&days=7`);
      const data: WeatherResponse = await response.json();
      
      if (data.success) {
        setWeatherData(data.data);
        setLastUpdated(new Date());
      } else {
        setError("Failed to fetch weather data");
      }
    } catch (error) {
      setError("Network error occurred");
      console.error("Weather fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchWeather(searchCity);
    
    const interval = setInterval(() => {
      if (weatherData) {
        fetchWeather(weatherData.city);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Get weather icon
  const getWeatherIcon = (condition: string) => {
    return WEATHER_ICONS[condition] || Cloud;
  };

  // Mini chart component for temperature trends
  const TemperatureChart = ({ data }: { data: Array<{ hour: number; temp: number }> }) => {
    const maxTemp = Math.max(...data.map(d => d.temp));
    const minTemp = Math.min(...data.map(d => d.temp));
    const range = maxTemp - minTemp || 1;

    return (
      <div className="relative h-20 flex items-end justify-between gap-1">
        {data.map((point, index) => {
          const height = ((point.temp - minTemp) / range) * 100;
          return (
            <div
              key={index}
              className="flex-1 bg-black/20 rounded-t-sm relative group"
              style={{ height: `${height}%` }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {point.temp}°
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">
                {point.hour}h
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: 'url(/images/weatherbg.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/50 to-white/60" />

      <div className="container-premium relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real-Time Weather Insights
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore real-time weather insights with interactive charts and clean data visualization. Powered by server-side data fetching for accurate and fast updates.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchWeather(searchCity)}
                    placeholder="Search city..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => fetchWeather(searchCity)}
                  disabled={loading}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Search'}
                </button>
              </div>
              
              {/* Popular Cities */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-sm text-gray-500">Popular:</span>
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSearchCity(city);
                      fetchWeather(city);
                    }}
                    className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {error && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800">{error}</p>
              </div>
            </motion.div>
          )}

          {weatherData && (
            <>
              {/* Current Weather Card */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    {/* Location and Time */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="text-2xl font-bold">{weatherData.city}</h3>
                          <p className="text-sm text-gray-500">
                            {weatherData.coordinates.lat.toFixed(2)}°, {weatherData.coordinates.lon.toFixed(2)}°
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Last updated</div>
                        <div className="text-sm font-medium">
                          {lastUpdated?.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    {/* Current Conditions */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                          {React.createElement(getWeatherIcon(weatherData.current.condition), {
                            className: "w-12 h-12 text-blue-600"
                          })}
                        </div>
                        <div>
                          <div className="text-5xl font-bold mb-2">
                            {weatherData.current.temp}°C
                          </div>
                          <div className="text-gray-600">
                            {weatherData.current.condition}
                          </div>
                          <div className="text-sm text-gray-500">
                            Feels like {weatherData.current.feelsLike}°C
                          </div>
                        </div>
                      </div>

                      {/* Weather Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Droplets className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="text-sm text-gray-500">Humidity</div>
                            <div className="font-semibold">{weatherData.current.humidity}%</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Wind className="w-5 h-5 text-gray-500" />
                          <div>
                            <div className="text-sm text-gray-500">Wind</div>
                            <div className="font-semibold">{weatherData.current.windSpeed} km/h</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Gauge className="w-5 h-5 text-purple-500" />
                          <div>
                            <div className="text-sm text-gray-500">Pressure</div>
                            <div className="font-semibold">{weatherData.current.pressure} hPa</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Eye className="w-5 h-5 text-green-500" />
                          <div>
                            <div className="text-sm text-gray-500">Visibility</div>
                            <div className="font-semibold">{weatherData.current.visibility} km</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Hourly Chart */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Today's Temperature Trend</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      Hourly forecast
                    </div>
                  </div>
                  <div className="mt-8 mb-8">
                    <TemperatureChart data={weatherData.hourly} />
                  </div>
                </div>
              </motion.div>

              {/* 7-Day Forecast */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">7-Day Forecast</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Extended forecast
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {weatherData.forecast.map((day, index) => {
                      const Icon = getWeatherIcon(day.condition);
                      const tempChange = index === 0 ? 0 : day.high - weatherData.forecast[index - 1].high;
                      
                      return (
                        <motion.div
                          key={day.date}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 text-center">
                                <div className="font-medium">{day.dayOfWeek}</div>
                                <div className="text-xs text-gray-500">{day.date.split('-')[2]}</div>
                              </div>
                              <Icon className="w-8 h-8 text-gray-600" />
                              <div>
                                <div className="font-medium">{day.condition}</div>
                                <div className="text-sm text-gray-500">
                                  Humidity: {day.humidity}%
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2 text-sm">
                                {tempChange > 0 ? (
                                  <TrendingUp className="w-4 h-4 text-red-500" />
                                ) : tempChange < 0 ? (
                                  <TrendingDown className="w-4 h-4 text-blue-500" />
                                ) : null}
                                <span className="text-gray-500">Wind: {day.windSpeed} km/h</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{day.high}°</div>
                                <div className="text-sm text-gray-500">{day.low}°</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Data Insights */}
              <motion.div variants={itemVariants}>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">i</span>
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Server-Side Data Processing</p>
                      <p className="text-blue-700">
                        Weather data is fetched and processed on the server for optimal performance and reliability. 
                        This ensures fast loading times and accurate, consistent data across all devices.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
