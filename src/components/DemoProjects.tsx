"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "EthioCurrency",
    description:
      "Currency converter with historical charts. Fetches real-time exchange rates with server-side caching.",
    frontend: ["React", "Chart.js"],
    backend: ["API Routes", "Server Caching"],
    demoUrl: "/demos/currency",
    githubUrl: "https://github.com/hayalstech/ethiocurrency",
    color: "bg-blue-500",
  },
  {
    title: "QR Generator Pro",
    description:
      "QR code generator with download and share capabilities. Server-side generation for reliability.",
    frontend: ["React UI", "Canvas Rendering"],
    backend: ["Server QR Generation", "Download API"],
    demoUrl: "/demos/qr",
    githubUrl: "https://github.com/hayalstech/qr-generator",
    color: "bg-purple-500",
  },
  {
    title: "WeatherScope",
    description:
      "Weather dashboard with interactive charts. Server-side data fetching and formatting.",
    frontend: ["React", "Charts", "Interactive UI"],
    backend: ["Weather API Route", "Server Formatting"],
    demoUrl: "/demos/weather",
    githubUrl: "https://github.com/hayalstech/weatherscope",
    color: "bg-cyan-500",
  },
  {
    title: "TaskFlow",
    description:
      "Kanban task manager with drag-and-drop. API endpoints for task management with database-ready architecture.",
    frontend: ["Drag-and-drop UI", "Board Interface"],
    backend: ["Task API Endpoints", "Database Architecture"],
    demoUrl: "/demos/tasks",
    githubUrl: "https://github.com/hayalstech/taskflow",
    color: "bg-green-500",
  },
  {
    title: "SpendTrack",
    description:
      "Personal finance tracker with analytics. Transaction processing and server-side calculations.",
    frontend: ["Charts", "Dashboard UI"],
    backend: ["Transaction APIs", "Analytics Engine"],
    demoUrl: "/demos/finance",
    githubUrl: "https://github.com/hayalstech/spendtrack",
    color: "bg-orange-500",
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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function DemoProjects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="demos"
      className="section-padding relative overflow-hidden"
      ref={ref}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{ backgroundImage: "url('/images/code-abstract.jpg')" }}
      />

      <div className="container-premium relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Full-Stack Demo Projects
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Each project demonstrates real backend functionality including API
            routes, server logic, and data processing—not just frontend UI.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Project Header */}
              <div className={`h-2 ${project.color}`} />

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Frontend
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.frontend.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Backend
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.backend.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-black text-white text-xs font-medium rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <a
                    href={project.demoUrl}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Live Demo
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2.5 bg-white text-black text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
