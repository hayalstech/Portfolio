"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Code, Server } from "lucide-react";

const frontendSkills = ["React", "Next.js", "Tailwind CSS"];
const backendSkills = ["API Development", "Server Logic", "Data Processing"];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background images for About section */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: 'url(/images/Aboutbg.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/50 to-white/60" />
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            About the Developer
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-gradient-to-br from-black via-neutral-900 to-black"
            >
              <div className="absolute inset-0 opacity-25 [background:radial-gradient(900px_circle_at_30%_20%,rgba(59,130,246,0.55),transparent_55%)]" />
              <div className="absolute inset-0 opacity-20 [background:radial-gradient(700px_circle_at_70%_70%,rgba(255,255,255,0.20),transparent_60%)]" />
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <p className="text-white text-2xl font-semibold tracking-tight">
                  Frontend performance & UX engineering
                </p>
                <p className="text-gray-300 text-sm mt-2 max-w-sm">
                  Core Web Vitals, scalable UI systems, and conversion-focused
                  experiences for modern product teams.
                </p>
              </div>
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
              <div className="space-y-4 text-gray-800 leading-relaxed mb-8">
                <p className="text-lg">
                  Hi, I&apos;m{" "}
                  <span className="text-black font-semibold">Hayalsew Asrat</span>
                  , a frontend-focused full-stack developer based in Addis Ababa,
                  Ethiopia. I design and build fast, reliable UIs that help
                  products convert and scale.
                </p>
                <p>
                  My work centers on Core Web Vitals, clean component systems,
                  and performance budgets—so the UX stays smooth as features and
                  traffic grow.
                </p>
              </div>

              {/* Skills Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Frontend Skills */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">Frontend</h3>
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
                    <h3 className="font-semibold text-gray-900">Backend</h3>
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
