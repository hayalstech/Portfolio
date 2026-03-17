import { NextRequest, NextResponse } from 'next/server';

// Generate mock historical data for demonstration
function generateHistoricalData(baseCurrency: string, targetCurrency: string, days: number = 7) {
  const data = [];
  const now = new Date();
  
  // Mock base rates
  const baseRates: { [key: string]: number } = {
    'ETB-USD': 0.018,
    'ETB-EUR': 0.016,
    'ETB-GBP': 0.014,
    'ETB-CAD': 0.025,
    'ETB-AUD': 0.027,
    'ETB-JPY': 2.65,
    'ETB-CNY': 0.13,
    'ETB-SAR': 0.067,
    'ETB-AED': 0.066,
  };
  
  const baseRate = baseRates[`${baseCurrency}-${targetCurrency}`] || 0.018;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some realistic variation
    const variation = (Math.random() - 0.5) * 0.002; // ±0.1% variation
    const rate = baseRate * (1 + variation * i * 0.3); // Slight trend
    
    data.push({
      date: date.toISOString().split('T')[0],
      rate: Number(rate.toFixed(6)),
    });
  }
  
  return data;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || 'ETB';
  const to = searchParams.get('to') || 'USD';
  const days = parseInt(searchParams.get('days') || '7');
  
  try {
    const data = generateHistoricalData(from, to, Math.min(days, 30)); // Max 30 days
    
    return NextResponse.json({
      from,
      to,
      data,
      generated: true,
      period: `${days} days`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate historical data' },
      { status: 500 }
    );
  }
}
