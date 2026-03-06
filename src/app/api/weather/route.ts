import { NextRequest, NextResponse } from "next/server";

// Mock weather data generator (in production, fetch from external weather API)
const weatherConditions = [
  "Clear sky",
  "Partly cloudy",
  "Cloudy",
  "Light rain",
  "Moderate rain",
  "Heavy rain",
  "Thunderstorm",
  "Snow",
];

const cities: Record<string, { lat: number; lon: number; timezone: string }> = {
  "addis ababa": { lat: 9.03, lon: 38.74, timezone: "Africa/Addis_Ababa" },
  "new york": { lat: 40.71, lon: -74.01, timezone: "America/New_York" },
  london: { lat: 51.51, lon: -0.13, timezone: "Europe/London" },
  tokyo: { lat: 35.68, lon: 139.69, timezone: "Asia/Tokyo" },
  paris: { lat: 48.86, lon: 2.35, timezone: "Europe/Paris" },
  sydney: { lat: -33.87, lon: 151.21, timezone: "Australia/Sydney" },
};

function generateWeatherData(city: string) {
  const cityData = cities[city.toLowerCase()] || {
    lat: 0,
    lon: 0,
    timezone: "UTC",
  };

  // Generate temperature based on latitude (simplified model)
  const baseTemp = 30 - Math.abs(cityData.lat) * 0.5;
  const currentTemp = Math.round(baseTemp + (Math.random() - 0.5) * 10);
  const feelsLike = Math.round(currentTemp + (Math.random() - 0.5) * 3);

  // Generate forecast
  const forecast = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const dayTemp = Math.round(baseTemp + (Math.random() - 0.5) * 15);
    const nightTemp = Math.round(dayTemp - 8 + (Math.random() - 0.5) * 4);

    forecast.push({
      date: date.toISOString().split("T")[0],
      dayOfWeek: date.toLocaleDateString("en-US", { weekday: "short" }),
      high: Math.max(dayTemp, nightTemp),
      low: Math.min(dayTemp, nightTemp),
      condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(5 + Math.random() * 20),
    });
  }

  // Generate hourly data for today
  const hourly = [];
  for (let i = 0; i < 24; i += 3) {
    const hourTemp = Math.round(currentTemp + Math.sin((i - 6) * Math.PI / 12) * 5);
    hourly.push({
      hour: i,
      temp: hourTemp,
      condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
    });
  }

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
    coordinates: {
      lat: cityData.lat,
      lon: cityData.lon,
    },
    timezone: cityData.timezone,
    current: {
      temp: currentTemp,
      feelsLike,
      condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(5 + Math.random() * 20),
      pressure: Math.round(1000 + Math.random() * 30),
      visibility: Math.round(8 + Math.random() * 4),
      uvIndex: Math.round(Math.random() * 11),
    },
    forecast,
    hourly,
    timestamp: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city") || "Addis Ababa";
  const days = parseInt(searchParams.get("days") || "7", 10);

  try {
    // Server-side validation
    if (!city || city.length > 100) {
      return NextResponse.json(
        { error: "Invalid city name" },
        { status: 400 }
      );
    }

    // Validate days parameter
    const validDays = Math.min(Math.max(days, 1), 14);

    // Generate weather data on the server
    const weatherData = generateWeatherData(city);

    // Limit forecast to requested days
    weatherData.forecast = weatherData.forecast.slice(0, validDays);

    return NextResponse.json({
      success: true,
      data: weatherData,
      cached: false,
      processed: true, // Indicates server-side processing occurred
    });
  } catch (error) {
    console.error("Weather API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}

// POST endpoint for batch city requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cities: cityList } = body;

    if (!Array.isArray(cityList) || cityList.length === 0) {
      return NextResponse.json(
        { error: "Please provide an array of cities" },
        { status: 400 }
      );
    }

    // Limit batch size
    const validCities = cityList.slice(0, 5);

    // Process all cities server-side
    const results = validCities.map((city) => ({
      city,
      data: generateWeatherData(city),
    }));

    return NextResponse.json({
      success: true,
      count: results.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Weather Batch API Error:", error);
    return NextResponse.json(
      { error: "Failed to process weather batch request" },
      { status: 500 }
    );
  }
}
