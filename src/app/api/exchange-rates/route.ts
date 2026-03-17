import { NextRequest, NextResponse } from 'next/server';

// Cache exchange rates for 1 hour
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
let cachedRates: any = null;
let lastFetchTime = 0;

// Fallback rates if API fails
const FALLBACK_RATES = {
  USD: 0.018,
  EUR: 0.016,
  GBP: 0.014,
  CAD: 0.025,
  AUD: 0.027,
  JPY: 2.65,
  CNY: 0.13,
  SAR: 0.067,
  AED: 0.066,
  ETB: 1, // Base currency
};

async function fetchExchangeRates() {
  try {
    // Using a free exchange rate API
    const response = await fetch(`https://open.er-api.com/v6/latest/ETB`);
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    
    if (data.result === 'success') {
      return data.rates;
    }
    
    throw new Error('API returned unsuccessful result');
  } catch (error) {
    console.warn('Failed to fetch exchange rates, using fallback:', error);
    return FALLBACK_RATES;
  }
}

export async function GET(request: NextRequest) {
  const now = Date.now();
  
  // Check if we have cached rates that are still valid
  if (cachedRates && (now - lastFetchTime) < CACHE_DURATION) {
    return NextResponse.json({
      rates: cachedRates,
      lastUpdated: lastFetchTime,
      cached: true
    });
  }
  
  // Fetch fresh rates
  const rates = await fetchExchangeRates();
  cachedRates = rates;
  lastFetchTime = now;
  
  return NextResponse.json({
    rates,
    lastUpdated: lastFetchTime,
    cached: false
  });
}

export async function POST(request: NextRequest) {
  try {
    const { from, to, amount } = await request.json();
    
    if (!from || !to || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters: from, to, amount' },
        { status: 400 }
      );
    }
    
    // Get current rates
    const ratesResponse = await fetch(request.url);
    const { rates } = await ratesResponse.json();
    
    // Convert amount
    const fromRate = rates[from] || 1;
    const toRate = rates[to] || 1;
    
    // Convert to base currency (ETB) first, then to target currency
    const amountInETB = amount / fromRate;
    const convertedAmount = amountInETB * toRate;
    
    return NextResponse.json({
      from,
      to,
      amount,
      convertedAmount: Number(convertedAmount.toFixed(6)),
      rate: Number((toRate / fromRate).toFixed(6)),
      timestamp: Date.now()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Conversion failed' },
      { status: 500 }
    );
  }
}
