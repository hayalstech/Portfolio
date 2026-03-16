"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Premium gradient background (no external images) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(1200px_circle_at_50%_0%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(900px_circle_at_20%_60%,rgba(59,130,246,0.35),transparent_55%)]" />

      <div className="container-premium relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-white"
          >
            Scalable SaaS builds that ship fast—and scale cleanly.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-4 font-medium"
          >
            <span className="text-white">Hayalsew Asrat</span> | Senior Full-Stack
            Product Engineer
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            I build SaaS & marketplace systems end-to-end—fast APIs, efficient
            infra, and polished UX—backed by measurable wins in speed, cost, and
            time-to-launch.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="#case-study"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              View case study
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
            >
              Discuss your project
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="https://github.com/hayalstech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-medium rounded-lg border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
            >
              <Github className="w-4 h-4" />
              GitHub Profile
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
