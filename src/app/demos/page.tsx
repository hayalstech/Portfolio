"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

const demos = [
  {
    title: "Ethiopian Currency Converter",
    description: "Real-time currency exchange rates with Ethiopian Birr and historical data visualization",
    url: "/interactive-demos",
    image: "/images/currency-converter.jpg",
    tech: ["React", "Node.js", "Exchange Rate API", "Chart.js"],
    features: ["Real-time Exchange Rates", "Historical Data", "Multiple Currencies", "Interactive Charts"]
  },
  {
    title: "QR Code Generator",
    description: "Advanced QR code generation with customization options and bulk processing",
    url: "/interactive-demos",
    image: "/images/qr-generator.jpg",
    tech: ["React", "QRCode.js", "Canvas API", "Download Functionality"],
    features: ["Custom QR Codes", "Bulk Generation", "Multiple Formats", "Color Customization"]
  },
  {
    title: "Weather Dashboard",
    description: "Comprehensive weather monitoring with forecasts and interactive maps",
    url: "/interactive-demos",
    image: "/images/weather-dashboard.jpg",
    tech: ["React", "Weather API", "Geolocation", "Data Visualization"],
    features: ["Current Weather", "7-Day Forecast", "Interactive Maps", "Location Search"]
  },
  {
    title: "Kanban Board",
    description: "Project management tool with drag-and-drop functionality and team collaboration",
    url: "/interactive-demos",
    image: "/images/kanban-board.jpg",
    tech: ["React", "Drag & Drop API", "State Management", "LocalStorage"],
    features: ["Task Management", "Drag & Drop", "Team Collaboration", "Progress Tracking"]
  },
  {
    title: "Expense Tracker",
    description: "Personal finance management with income/expense tracking and analytics",
    url: "/interactive-demos",
    image: "/images/expense-tracker.jpg",
    tech: ["React", "Chart.js", "LocalStorage", "Date Processing"],
    features: ["Income/Expense Tracking", "Financial Analytics", "Budget Management", "Export Reports"]
  }
];

export default function DemosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Portfolio</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Project Demos</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Live Project Demonstrations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore my full-stack development projects with real functionality and modern design
          </p>
        </motion.div>

        {/* Demo Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Preview Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-2">🚀</div>
                    <div className="text-lg font-semibold">{demo.title}</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{demo.title}</h3>
                <p className="text-gray-600 mb-4">{demo.description}</p>

                {/* Tech Stack */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Technology Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {demo.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {demo.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href={demo.url}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Demo
                  </Link>
                  <button className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-300">
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to see more?
            </h3>
            <p className="text-gray-600 mb-6">
              These are just a few examples of my work. I have many more projects showcasing different technologies and approaches.
            </p>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Get In Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
