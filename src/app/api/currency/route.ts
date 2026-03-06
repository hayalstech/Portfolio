import { NextRequest, NextResponse } from "next/server";

// In-memory cache with TTL
interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Mock exchange rates (in production, fetch from external API)
const exchangeRates: Record<string, number> = {
  USD: 1,
  ETB: 55.5, // Ethiopian Birr
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.2,
  CAD: 1.35,
  AUD: 1.52,
  CHF: 0.88,
  CNY: 7.19,
  INR: 83.1,
};

// Generate historical data for charts
function generateHistoricalData(base: string, target: string, days: number) {
  const data = [];
  const baseRate = exchangeRates[target] / exchangeRates[base];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Add some random fluctuation (±2%)
    const fluctuation = 1 + (Math.random() - 0.5) * 0.04;
    const rate = baseRate * fluctuation;

    data.push({
      date: date.toISOString().split("T")[0],
      rate: parseFloat(rate.toFixed(4)),
    });
  }

  return data;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const base = searchParams.get("base") || "USD";
  const target = searchParams.get("target") || "ETB";
  const history = searchParams.get("history") === "true";

  try {
    // Validate currencies
    if (!exchangeRates[base] || !exchangeRates[target]) {
      return NextResponse.json(
        { error: "Invalid currency code" },
        { status: 400 }
      );
    }

    const cacheKey = `${base}-${target}-${history}`;
    const cached = getCachedData(cacheKey);

    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }

    const baseRate = exchangeRates[target] / exchangeRates[base];

    const response = {
      base,
      target,
      rate: parseFloat(baseRate.toFixed(4)),
      inverseRate: parseFloat((1 / baseRate).toFixed(4)),
      timestamp: new Date().toISOString(),
      cached: false,
      ...(history && { historicalData: generateHistoricalData(base, target, 30) }),
    };

    // Cache the response
    setCachedData(cacheKey, response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Currency API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchange rates" },
      { status: 500 }
    );
  }
}

// Convert amount between currencies
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, from, to } = body;

    if (!amount || !from || !to) {
      return NextResponse.json(
        { error: "Missing required fields: amount, from, to" },
        { status: 400 }
      );
    }

    if (!exchangeRates[from] || !exchangeRates[to]) {
      return NextResponse.json(
        { error: "Invalid currency code" },
        { status: 400 }
      );
    }

    const rate = exchangeRates[to] / exchangeRates[from];
    const converted = parseFloat((amount * rate).toFixed(2));

    return NextResponse.json({
      original: { amount, currency: from },
      converted: { amount: converted, currency: to },
      rate: parseFloat(rate.toFixed(4)),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Currency Conversion Error:", error);
    return NextResponse.json(
      { error: "Failed to convert currency" },
      { status: 500 }
    );
  }
}
