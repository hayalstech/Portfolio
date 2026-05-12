"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, Sparkles, Zap } from "lucide-react";

const upcomingProjects = [
  {
    icon: Sparkles,
    title: "AI-Powered Analytics Dashboard",
    description: "Real-time data visualization with machine learning insights",
    status: "In Development",
  },
  {
    icon: Zap,
    title: "E-Commerce Platform",
    description: "Full-featured online store with payment integration",
    status: "Planning",
  },
  {
    icon: Clock,
    title: "Mobile App",
    description: "Cross-platform mobile application for portfolio services",
    status: "Coming Soon",
  },
];

export default function ComingSoon() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section id="coming-soon" ref={ref} className="section-padding relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: 'url(/images/tech-abstract.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/50 to-white/60" />
      
      <div className="container-premium relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Coming Soon
          </h2>
          <p className="text-gray-800 max-w-2xl mx-auto">
            Exciting projects currently in development. Stay tuned for more innovative solutions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {upcomingProjects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card-interactive bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-gray-900 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-400/30">
                <project.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">{project.title}</h3>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                {project.description}
              </p>
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                {project.status}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
