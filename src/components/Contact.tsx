"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Github, Briefcase } from "lucide-react";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    href: "mailto:hayalstech@gmail.com",
    description: "Get in touch directly",
    primary: true,
  },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/hayalstech",
    description: "View my code",
    primary: false,
  },
  {
    icon: Briefcase,
    label: "Upwork",
    href: "https://www.upwork.com/freelancers/~hayalstech",
    description: "Hire me for projects",
    primary: false,
  },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="section-padding relative overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: 'url(/images/hedd.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/50 to-white/60" />
      
      <div className="container-premium relative z-10">
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(900px_circle_at_50%_20%,rgba(0,0,0,0.06),transparent_60%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Let&apos;s Build Something
          </h2>
          <p className="text-gray-800 max-w-2xl mx-auto">
            Stop compromising on speed—invite me and I’ll map a clear plan to hit
            your UX and performance targets.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <div className="grid sm:grid-cols-3 gap-4">
            {contactLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto")
                    ? undefined
                    : "noopener noreferrer"
                }
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col items-center p-6 rounded-2xl border transition-all duration-200 ${
                  link.primary
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "bg-white text-black border-gray-200 hover:border-gray-400 hover:shadow-lg"
                }`}
              >
                <link.icon className="w-8 h-8 mb-3" />
                <span className="font-semibold mb-1">{link.label}</span>
                <span
                  className={`text-sm ${
                    link.primary ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {link.description}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
