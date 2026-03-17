"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  QrCode, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Palette, 
  Settings,
  Link,
  Mail,
  Phone,
  MapPin,
  Wifi,
  Calendar
} from "lucide-react";

interface QRCodeOptions {
  text: string;
  size: number;
  darkColor: string;
  lightColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

interface QRCodeResult {
  success: boolean;
  dataURL: string;
  buffer: string;
  options: QRCodeOptions;
}

const PRESET_COLORS = [
  { name: 'Classic', dark: '#000000', light: '#FFFFFF' },
  { name: 'Blue', dark: '#1e40af', light: '#dbeafe' },
  { name: 'Green', dark: '#059669', light: '#d1fae5' },
  { name: 'Purple', dark: '#7c3aed', light: '#ede9fe' },
  { name: 'Red', dark: '#dc2626', light: '#fee2e2' },
  { name: 'Orange', dark: '#ea580c', light: '#fed7aa' },
];

const CONTENT_TEMPLATES = [
  { 
    icon: Link, 
    label: 'URL', 
    placeholder: 'https://example.com',
    example: 'https://hayalstech.com'
  },
  { 
    icon: Mail, 
    label: 'Email', 
    placeholder: 'mailto:email@example.com',
    example: 'mailto:hayalsew@example.com'
  },
  { 
    icon: Phone, 
    label: 'Phone', 
    placeholder: 'tel:+1234567890',
    example: 'tel:+251912345678'
  },
  { 
    icon: MapPin, 
    label: 'Location', 
    placeholder: 'geo:37.7749,-122.4194',
    example: 'geo:9.1450,40.4897'
  },
  { 
    icon: Wifi, 
    label: 'WiFi', 
    placeholder: 'WIFI:T:WPA;S:NetworkName;P:Password;;',
    example: 'WIFI:T:WPA;S:MyWiFi;P:password123;;'
  },
  { 
    icon: Calendar, 
    label: 'Event', 
    placeholder: 'BEGIN:VEVENT SUMMARY:Meeting END:VEVENT',
    example: 'BEGIN:VEVENT SUMMARY:Portfolio Launch END:VEVENT'
  },
];

export default function QRCodeGenerator() {
  const [options, setOptions] = useState<QRCodeOptions>({
    text: 'https://hayalstech.com',
    size: 300,
    darkColor: '#000000',
    lightColor: '#FFFFFF',
    errorCorrectionLevel: 'M',
  });

  const [qrResult, setQrResult] = useState<QRCodeResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR Code
  const generateQRCode = async () => {
    if (!options.text.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      const result: QRCodeResult = await response.json();
      
      if (result.success) {
        setQrResult(result);
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate on text change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (options.text.trim()) {
        generateQRCode();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [options.text, options.size, options.darkColor, options.lightColor, options.errorCorrectionLevel]);

  // Download QR Code
  const downloadQRCode = (format: 'png' | 'svg') => {
    if (!qrResult) return;

    if (format === 'png') {
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = qrResult.dataURL;
      link.click();
    } else {
      // For SVG, we'll create a simple download
      fetch(`/api/generate-qr?text=${encodeURIComponent(options.text)}&format=svg&size=${options.size}`)
        .then(response => response.text())
        .then(svg => {
          const blob = new Blob([svg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `qrcode-${Date.now()}.svg`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        });
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!qrResult) return;

    try {
      const blob = await fetch(qrResult.dataURL).then(r => r.blob());
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Share QR Code
  const shareQRCode = async () => {
    if (!qrResult) return;

    try {
      if (navigator.share) {
        const blob = await fetch(qrResult.dataURL).then(r => r.blob());
        const file = new File([blob], 'qrcode.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'QR Code',
          text: `QR Code for: ${options.text}`,
          files: [file],
        });
      } else {
        // Fallback: copy to clipboard
        copyToClipboard();
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  // Apply template
  const applyTemplate = (templateIndex: number) => {
    setActiveTemplate(templateIndex);
    const template = CONTENT_TEMPLATES[templateIndex];
    setOptions(prev => ({ ...prev, text: template.example }));
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
        style={{ backgroundImage: 'url(/images/QRbackground.jpg)' }}
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
              High-Quality QR Code Generator
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Generate high-quality QR codes instantly with download and sharing options. Built with server-side rendering for speed, reliability, and seamless user experience.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Content Templates */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold mb-4">Content Type</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CONTENT_TEMPLATES.map((template, index) => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => applyTemplate(index)}
                        className={`p-3 rounded-lg border transition-all ${
                          activeTemplate === index
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-medium">{template.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Input */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={options.text}
                  onChange={(e) => setOptions(prev => ({ ...prev, text: e.target.value }))}
                  placeholder={CONTENT_TEMPLATES[activeTemplate].placeholder}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Settings */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Customization</h3>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size: {options.size}px
                      </label>
                      <input
                        type="range"
                        min="200"
                        max="500"
                        value={options.size}
                        onChange={(e) => setOptions(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>

                    {/* Color Presets */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Scheme
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {PRESET_COLORS.map((preset, index) => (
                          <button
                            key={index}
                            onClick={() => setOptions(prev => ({ 
                              ...prev, 
                              darkColor: preset.dark, 
                              lightColor: preset.light 
                            }))}
                            className={`p-2 rounded-lg border transition-all ${
                              options.darkColor === preset.dark && options.lightColor === preset.light
                                ? 'border-black'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              <div 
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: preset.dark }}
                              />
                              <div 
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: preset.light }}
                              />
                            </div>
                            <div className="text-xs mt-1">{preset.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Error Correction */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Error Correction Level
                      </label>
                      <select
                        value={options.errorCorrectionLevel}
                        onChange={(e) => setOptions(prev => ({ 
                          ...prev, 
                          errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H'
                        }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="L">Low (7%)</option>
                        <option value="M">Medium (15%)</option>
                        <option value="Q">Quartile (25%)</option>
                        <option value="H">High (30%)</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* QR Code Display */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Generated QR Code</h3>
                  {isGenerating && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </div>
                  )}
                </div>

                {/* QR Code Display */}
                <div className="flex justify-center mb-6">
                  {qrResult ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <img
                        src={qrResult.dataURL}
                        alt="Generated QR Code"
                        className="rounded-lg shadow-lg"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                      <div className="absolute -bottom-2 -right-2 bg-black text-white text-xs px-2 py-1 rounded">
                        {qrResult.options.size}px
                      </div>
                    </motion.div>
                  ) : (
                    <div className="w-[300px] h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {qrResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {/* Download PNG */}
                    <button
                      onClick={() => downloadQRCode('png')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      PNG
                    </button>

                    {/* Download SVG */}
                    <button
                      onClick={() => downloadQRCode('svg')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      SVG
                    </button>

                    {/* Copy to Clipboard */}
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>

                    {/* Share */}
                    <button
                      onClick={shareQRCode}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">i</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Server-Side Generation</p>
                    <p className="text-blue-700">
                      QR codes are generated on the server for maximum quality and performance. 
                      This ensures consistent results across all devices and browsers.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
