"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Zap, 
  Globe, 
  Server, 
  Shield, 
  TrendingUp, 
  Clock, 
  Users,
  Database,
  Cloud,
  Lock
} from "lucide-react";

const frontendTech = [
  { name: "React", icon: "⚛️", description: "Modern UI framework" },
  { name: "Next.js", icon: "▲", description: "Full-stack framework" },
  { name: "Tailwind CSS", icon: "🎨", description: "Utility-first CSS" },
  { name: "TypeScript", icon: "📘", description: "Type-safe JavaScript" },
];

const backendTech = [
  { name: "API Routes", icon: "🔌", description: "Server-side endpoints" },
  { name: "REST APIs", icon: "🌐", description: "RESTful services" },
  { name: "Server Logic", icon: "⚙️", description: "Business logic" },
  { name: "Authentication", icon: "🔐", description: "Secure user access" },
];

const metrics = [
  { 
    label: "API Latency", 
    value: "-50%", 
    icon: Zap, 
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  { 
    label: "Server Cost", 
    value: "-30%", 
    icon: TrendingUp, 
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  { 
    label: "MVP Delivery", 
    value: "6 weeks", 
    icon: Clock, 
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  { 
    label: "User Growth", 
    value: "+150%", 
    icon: Users, 
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
];

export default function Web() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
    <section className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: 'url(/images/webbg.jpg)' }}
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
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Scalable SaaS Rebuild with Measurable Speed + Cost Wins
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete platform transformation delivering 50% faster performance with 30% cost reduction and 6-week MVP delivery.
            </p>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${metric.bgColor} mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-1 ${metric.color}`}>
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {metric.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Frontend */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Globe className="w-6 h-6 text-blue-600" />
                    Frontend Technologies
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {frontendTech.map((tech, index) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-2xl">{tech.icon}</span>
                        <div>
                          <div className="font-semibold">{tech.name}</div>
                          <div className="text-sm text-gray-600">{tech.description}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Backend */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Server className="w-6 h-6 text-green-600" />
                    Backend Technologies
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {backendTech.map((tech, index) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-2xl">{tech.icon}</span>
                        <div>
                          <div className="font-semibold">{tech.name}</div>
                          <div className="text-sm text-gray-600">{tech.description}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Project Details */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-600" />
              Project Transformation Details
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Performance Optimization</h4>
                  <p className="text-gray-600">
                    Implemented advanced caching strategies and optimized database queries resulting in 50% reduction in API response times.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Cloud className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Infrastructure Modernization</h4>
                  <p className="text-gray-600">
                    Migrated to serverless architecture reducing infrastructure costs by 30% while improving scalability.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Security Enhancement</h4>
                  <p className="text-gray-600">
                    Implemented enterprise-grade security protocols and authentication systems for enhanced data protection.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Discuss Your SaaS Project
              <TrendingUp className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
