"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

export default function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const [isHovered, setIsHovered] = useState(false);

  const particles = useMemo(
    () =>
      [...Array(20)].map((_, i) => {
        const left = `${(i * 13 + 7) % 100}%`;
        const top = `${(i * 23 + 11) % 100}%`;
        const duration = 3 + ((i * 17) % 20) / 10;
        const delay = ((i * 19) % 20) / 10;
        return { left, top, duration, delay };
      }),
    []
  );

  // Motion values for 3D transforms
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [-15, 15]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), {
    stiffness: 300,
    damping: 30,
  });
  const scale = useSpring(isHovered ? 1.05 : 1, {
    stiffness: 300,
    damping: 30,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      mouseX.set(0.5);
      mouseY.set(0.5);
    };

    const element = ref.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [mouseX, mouseY]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: 'url(/images/pexels-alex-dos-santos-305643819-26172887 (9).jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-neutral-950/90 to-black/95" />
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(1200px_circle_at_50%_0%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(900px_circle_at_20%_60%,rgba(59,130,246,0.35),transparent_55%)]" />

      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container-premium relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center"
        >
          {/* 3D Card Container */}
          <motion.div
            ref={ref}
            style={{
              rotateX: rotateX,
              rotateY: rotateY,
              scale: scale,
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
            className="relative mb-12 hero-3d-card gpu-accelerated"
          >
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
              {/* Glass morphism effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Profile Image */}
                <motion.div
                  variants={itemVariants}
                  className="mb-8"
                >
                  <div className="relative inline-block">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl flex items-center justify-center bg-white/10"
                    >
                      <Image
                        src="/images/profile.png"
                        alt="Profile"
                        width={160}
                        height={160}
                        className="w-full h-full object-cover scale-110"
                      />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                    Building Digital
                    <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Experiences
                    </span>
                  </h1>
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed"
                >
                  Full-stack developer crafting scalable web solutions with modern technologies
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                >
                  <motion.a
                    href="#contact"
                    className="btn-interactive relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">Get In Touch</span>
                    <ArrowRight className="w-5 h-5 relative z-10" />
                  </motion.a>

                  <motion.a
                    href="#projects"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Projects
                  </motion.a>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex justify-center gap-6"
                >
                  <motion.a
                    href="https://github.com/hayalstech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>

                  <motion.a
                    href="https://www.linkedin.com/in/hayalsewasrat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>

                  <motion.a
                    href="mailto:hayalstech@gmail.com"
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Mail className="w-5 h-5" />
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Floating 3D elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="floating-3d-element absolute w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm rounded-2xl border border-white/10 gpu-accelerated"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + (i % 2) * 40}%`,
                }}
                animate={{
                  rotateY: [0, 360],
                  rotateX: [0, 360],
                  scale: [1, 1.2, 1],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
