"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Layers, LayoutGrid, Wrench, Github } from "lucide-react";

const highlights = [
  {
    icon: Layers,
    title: "Full-Stack Applications",
    description:
      "Modern projects with frontend UI and backend logic working seamlessly together.",
  },
  {
    icon: LayoutGrid,
    title: "Clean Architecture",
    description:
      "Modular components and structured APIs for maintainable, scalable code.",
  },
  {
    icon: Wrench,
    title: "Real-World Tools",
    description:
      "Dashboards, utilities, and productivity apps solving practical problems.",
  },
  {
    icon: Github,
    title: "GitHub Ready",
    description:
      "Source code documented and deployed with CI/CD best practices.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
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

export default function FeaturedHighlights() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{ backgroundImage: "url('/images/pexels-canvy-mockups-56805-205316.jpg')" }}
      />

      <div className="container-premium relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Highlights
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            What makes these projects stand out in the modern web development
            landscape
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {highlights.map((highlight) => (
            <motion.div
              key={highlight.title}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-4">
                <highlight.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{highlight.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
