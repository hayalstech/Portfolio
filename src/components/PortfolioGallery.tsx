"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  ExternalLink, 
  Github, 
  Calendar, 
  Star,
  Globe
} from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with real-time inventory management, payment processing, and analytics dashboard.",
    image: "/images/17973908.jpg",
    tech: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/hayalstech/ecommerce",
    category: "Web Development",
    featured: true,
    stats: {
      stars: 45,
      forks: 12,
      users: "1.2k",
      year: "2024"
    }
  },
  {
    title: "Real-time Analytics Dashboard",
    description: "Interactive data visualization platform with WebSocket integration, real-time updates, and custom charts.",
    image: "/images/webbg.jpg",
    tech: ["React", "Node.js", "WebSocket", "D3.js"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/hayalstech/analytics",
    category: "Data Visualization",
    featured: true,
    stats: {
      stars: 89,
      forks: 23,
      users: "3.5k",
      year: "2024"
    }
  },
  {
    title: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication, transaction history, and budget tracking.",
    image: "/images/pexels-alex-dos-santos-305643819-26172887.jpg",
    tech: ["React Native", "TypeScript", "Firebase", "Redux"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/hayalstech/mobile-banking",
    category: "Mobile Development",
    featured: false,
    stats: {
      stars: 67,
      forks: 18,
      users: "2.8k",
      year: "2023"
    }
  },
  {
    title: "AI Content Generator",
    description: "Machine learning powered content creation tool with multiple AI models and custom templates.",
    image: "/images/hedd.jpg",
    tech: ["Python", "TensorFlow", "FastAPI", "React"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/hayalstech/ai-content",
    category: "AI/ML",
    featured: true,
    stats: {
      stars: 156,
      forks: 42,
      users: "8.9k",
      year: "2024"
    }
  },
  {
    title: "Task Management System",
    description: "Collaborative project management tool with Kanban boards, team collaboration, and time tracking.",
    image: "/images/Taskbg.jpg",
    tech: ["Vue.js", "Node.js", "MongoDB", "Socket.io"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/hayalstech/task-manager",
    category: "Productivity",
    featured: false,
    stats: {
      stars: 34,
      forks: 8,
      users: "1.5k",
      year: "2023"
    }
  },
  {
    title: "Social Media Analytics",
    description: "Comprehensive social media monitoring platform with sentiment analysis and engagement tracking.",
    image: "/images/weatherbg.jpg",
    tech: ["Next.js", "Python", "Redis", "Docker"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/hayalstech/social-analytics",
    category: "Analytics",
    featured: true,
    stats: {
      stars: 92,
      forks: 31,
      users: "4.2k",
      year: "2024"
    }
  }
];

const categories = ["All", "Web Development", "Mobile Development", "AI/ML", "Data Visualization", "Analytics", "Productivity"];

export default function PortfolioGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState(projects);

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

  const filterProjects = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((project: typeof projects[0]) => project.category === category));
    }
  };

  return (
    <section className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: 'url(/images/tech-abstract.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/50 to-white/60" />

      <div className="container-premium relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Featured Projects
            </h2>
            <p className="text-gray-800 max-w-2xl mx-auto">
              Explore my best work across different technologies and domains. Each project represents 
              real-world challenges solved with modern solutions.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => filterProjects(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProjects.map((project: typeof projects[0], index: number) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${
                  project.featured ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
              >
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                      Featured
                    </span>
                  </div>
                )}

                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.slice(0, 3).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {project.stats.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <Github className="w-3 h-3" />
                        {project.stats.forks}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {project.stats.year}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Live Demo
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
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
              See More on GitHub
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
