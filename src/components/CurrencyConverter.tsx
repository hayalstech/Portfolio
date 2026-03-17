"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRightLeft, TrendingUp, Clock, RefreshCw, LineChart } from "lucide-react";
import ExchangeRateChart from "./ExchangeRateChart";

interface ExchangeRates {
  [key: string]: number;
}

interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  timestamp: number;
}

interface HistoricalData {
  date: string;
  rate: number;
}

const CURRENCIES = [
  { code: "ETB", name: "Ethiopian Birr", flag: "🇪🇹" },
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
];

export default function CurrencyConverter() {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);
  const [fromCurrency, setFromCurrency] = useState("ETB");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("1000");
  const [conversion, setConversion] = useState<ConversionResult | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [showChart, setShowChart] = useState(false);

  // Fetch exchange rates
  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/exchange-rates");
      const data = await response.json();
      
      setRates(data.rates);
      setLastUpdated(new Date(data.lastUpdated));
    } catch (error) {
      console.error("Failed to fetch rates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Convert currency
  const convertCurrency = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsConverting(true);
    try {
      const response = await fetch("/api/exchange-rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromCurrency,
          to: toCurrency,
          amount: parseFloat(amount),
        }),
      });
      
      const result = await response.json();
      setConversion(result);
    } catch (error) {
      console.error("Conversion failed:", error);
    } finally {
      setIsConverting(false);
    }
  };

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConversion(null);
  };

  // Fetch historical data
  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(
        `/api/historical-rates?from=${fromCurrency}&to=${toCurrency}&days=7`
      );
      const data = await response.json();
      setHistoricalData(data.data || []);
    } catch (error) {
      console.error("Failed to fetch historical data:", error);
    }
  };

  // Auto-convert on input change
  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && rates[fromCurrency] && rates[toCurrency]) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency]);

  // Fetch historical data when currencies change
  useEffect(() => {
    if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      fetchHistoricalData();
    }
  }, [fromCurrency, toCurrency]);

  // Initial fetch
  useEffect(() => {
    fetchRates();
    
    // Refresh rates every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
        style={{ backgroundImage: 'url(/images/Currencybg.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/50 to-white/60" />

      <div className="container-premium relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ethiopian Birr Currency Converter
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Convert currencies in real-time with accurate exchange rates and interactive historical charts. Optimized with server-side caching for fast performance and reliable data.
            </p>
          </motion.div>

          {/* Status Bar */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {lastUpdated ? (
                    <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                  ) : (
                    <span>Loading...</span>
                  )}
                </div>
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating rates...</span>
                  </div>
                )}
              </div>
              <button
                onClick={fetchRates}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </motion.div>

          {/* Converter Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* From Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="space-y-3">
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center md:mt-8">
                <button
                  onClick={swapCurrencies}
                  className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>
              </div>

              {/* To Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="space-y-3">
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    {conversion ? (
                      <div className="text-lg font-semibold">
                        {conversion.convertedAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-400">Converted amount</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Result */}
            {conversion && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">
                      1 {conversion.from} = {conversion.rate} {conversion.to}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(conversion.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Historical Chart */}
          {showChart && historicalData.length > 0 && (
            <motion.div variants={itemVariants} className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Historical Trends</h3>
                <button
                  onClick={() => setShowChart(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Hide chart
                </button>
              </div>
              <ExchangeRateChart
                data={historicalData}
                currency={toCurrency}
                baseCurrency={fromCurrency}
              />
            </motion.div>
          )}

          {/* Show Chart Button */}
          {!showChart && fromCurrency !== toCurrency && (
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <button
                onClick={() => setShowChart(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <LineChart className="w-4 h-4" />
                View Historical Chart
              </button>
            </motion.div>
          )}

          {/* Exchange Rates Table */}
          <motion.div variants={itemVariants} className="mt-8">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold">Current Exchange Rates (Base: ETB)</h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {Object.entries(rates)
                  .filter(([code]) => code !== "ETB")
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([code, rate]) => {
                    const currency = CURRENCIES.find(c => c.code === code);
                    return (
                      <div key={code} className="flex items-center justify-between p-3 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{currency?.flag}</span>
                          <div>
                            <div className="font-medium">{code}</div>
                            <div className="text-sm text-gray-500">{currency?.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{rate.toFixed(4)}</div>
                          <div className="text-sm text-gray-500">per ETB</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
