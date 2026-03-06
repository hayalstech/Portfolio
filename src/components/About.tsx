"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Code, Server } from "lucide-react";
import Image from "next/image";

const frontendSkills = ["React", "Next.js", "Tailwind CSS"];
const backendSkills = ["API Development", "Server Logic", "Data Processing"];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding bg-gray-50/50" ref={ref}>
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About the Developer
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src="/images/workspace.jpg"
                alt="Developer workspace"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              {/* Location Badge */}
              <div className="flex items-center gap-2 text-gray-500 mb-6">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Addis Ababa, Ethiopia</span>
              </div>

              {/* Bio */}
              <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
                <p className="text-lg">
                  Hi, I&apos;m{" "}
                  <span className="text-black font-semibold">Hayalsew Asrat</span>
                  , a developer based in Addis Ababa, Ethiopia. I build modern
                  full-stack web applications with clean interfaces and scalable
                  backend logic.
                </p>
                <p>
                  My focus is creating tools that combine great user experience
                  with reliable backend functionality. Every project in this
                  portfolio demonstrates real backend capabilities—not just
                  frontend presentation.
                </p>
              </div>

              {/* Skills Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Frontend Skills */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-gray-700" />
                    <h3 className="font-semibold">Frontend</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {frontendSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Backend Skills */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Server className="w-5 h-5 text-gray-700" />
                    <h3 className="font-semibold">Backend</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {backendSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-black text-white text-sm font-medium rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
