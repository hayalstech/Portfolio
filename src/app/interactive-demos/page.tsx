"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, QrCode, Cloud, KanbanSquare, DollarSign } from "lucide-react";
import Link from "next/link";

// Import all demo components
import CurrencyConverter from "../../components/CurrencyConverter";
import QRCodeGenerator from "../../components/QRCodeGenerator";
import WeatherDashboard from "../../components/WeatherDashboard";
import KanbanBoard from "../../components/KanbanBoard";
import ExpenseTracker from "../../components/ExpenseTracker";

const demos = [
  {
    id: "currency",
    title: "Ethiopian Currency Converter",
    description: "Real-time currency exchange rates with Ethiopian Birr and historical data visualization",
    icon: TrendingUp,
    component: CurrencyConverter,
  },
  {
    id: "qr",
    title: "QR Code Generator",
    description: "Advanced QR code generation with customization options and bulk processing",
    icon: QrCode,
    component: QRCodeGenerator,
  },
  {
    id: "weather",
    title: "Weather Dashboard",
    description: "Comprehensive weather monitoring with forecasts and interactive maps",
    icon: Cloud,
    component: WeatherDashboard,
  },
  {
    id: "kanban",
    title: "Kanban Board",
    description: "Project management tool with drag-and-drop functionality and team collaboration",
    icon: KanbanSquare,
    component: KanbanBoard,
  },
  {
    id: "expense",
    title: "Expense Tracker",
    description: "Personal finance management with income/expense tracking and analytics",
    icon: DollarSign,
    component: ExpenseTracker,
  },
];

export default function InteractiveDemosPage() {
  const [activeDemo, setActiveDemo] = useState("currency");

  useEffect(() => {
    // Smooth scroll to demo section when active demo changes
    const element = document.getElementById(activeDemo);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeDemo]);

  const ActiveDemoComponent = demos.find(demo => demo.id === activeDemo)?.component || CurrencyConverter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Portfolio</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Interactive Demos</h1>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 gap-2">
            {demos.map((demo) => {
              const Icon = demo.icon;
              return (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                    activeDemo === demo.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{demo.title}</span>
                  <span className="sm:hidden">{demo.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Demo Header */}
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              {(() => {
                const Icon = demos.find(d => d.id === activeDemo)?.icon || TrendingUp;
                return <Icon className="w-6 h-6 text-blue-600" />;
              })()}
              <h2 className="text-2xl font-bold text-gray-900">
                {demos.find(d => d.id === activeDemo)?.title}
              </h2>
            </div>
            <p className="text-gray-600">
              {demos.find(d => d.id === activeDemo)?.description}
            </p>
          </div>
        </motion.div>

        {/* Active Demo Component */}
        <motion.div
          key={`demo-${activeDemo}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          id={activeDemo}
          className="min-h-[600px]"
        >
          <ActiveDemoComponent />
        </motion.div>

        {/* Quick Navigation */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Navigation</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demos.map((demo) => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.id}
                    onClick={() => setActiveDemo(demo.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      activeDemo === demo.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      activeDemo === demo.id ? "text-blue-600" : "text-gray-600"
                    }`} />
                    <div className="text-left">
                      <div className={`font-medium ${
                        activeDemo === demo.id ? "text-blue-900" : "text-gray-900"
                      }`}>
                        {demo.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {demo.description.substring(0, 60)}...
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to see more?
            </h3>
            <p className="text-gray-600 mb-6">
              These interactive demos showcase my full-stack development skills with real functionality and modern design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                View Demo Details
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-300"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
