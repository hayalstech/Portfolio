"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Code, 
  Zap, 
  Palette, 
  Globe, 
  Rocket,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Full-Stack Development",
    description: "End-to-end web application development using modern technologies and best practices.",
    features: [
      "React/Next.js applications",
      "RESTful API development",
      "Database design & optimization",
      "Performance optimization"
    ],
    price: "Starting at $5,000",
    popular: true
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Speed up your existing applications with advanced optimization techniques.",
    features: [
      "Core Web Vitals improvement",
      "Bundle size optimization",
      "Database query optimization",
      "Caching strategies"
    ],
    price: "Starting at $2,000",
    popular: false
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, user-centered design that converts visitors into customers.",
    features: [
      "Responsive web design",
      "Component systems",
      "Design systems",
      "User experience research"
    ],
    price: "Starting at $3,000",
    popular: false
  },
  {
    icon: Globe,
    title: "Technical Consulting",
    description: "Strategic guidance for your technical decisions and architecture.",
    features: [
      "Architecture planning",
      "Technology stack selection",
      "Code review & audit",
      "Team training"
    ],
    price: "Starting at $150/hour",
    popular: true
  },
  {
    icon: Rocket,
    title: "MVP Development",
    description: "Rapid prototype development to validate your business ideas quickly.",
    features: [
      "Quick iteration cycles",
      "Lean development approach",
      "User testing integration",
      "Scalable foundation"
    ],
    price: "Starting at $8,000",
    popular: false
  }
];

export default function Services() {
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
        style={{ backgroundImage: 'url(/images/pexels-alex-dos-santos-305643819-26172887.jpg)' }}
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
              Services & Solutions
            </h2>
            <p className="text-gray-800 max-w-2xl mx-auto">
              Professional services tailored to help you build, optimize, and scale your digital products. 
              From concept to deployment, I've got you covered.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${
                    service.popular ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}
                >
                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                        Popular
                      </span>
                    </div>
                  )}

                  {/* Service Icon */}
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
                    <Icon className="w-8 h-8 text-gray-900" />
                  </div>

                  {/* Service Content */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        {service.price}
                      </span>
                      <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                        Get Started
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Discuss Your Project
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
