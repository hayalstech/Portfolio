"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Mail,
  Github,
  Linkedin,
  Phone,
  Briefcase,
} from "lucide-react";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    href: "mailto:hayalstech@gmail.com",
    description: "Get in touch directly",
    primary: true,
  },
  {
    icon: Phone,
    label: "Phone",
    href: "tel:+251987037035",
    description: "Call or message",
    primary: false,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hayalsewasrat",
    description: "Connect professionally",
    primary: false,
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

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function Contact() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="section-padding relative overflow-hidden"
      aria-labelledby="contact-heading"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url(/images/pexels-alex-dos-santos-305643819-26172887 (5).jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/55 to-white/65" />

      <div className="container-premium relative z-10">
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(900px_circle_at_50%_20%,rgba(0,0,0,0.06),transparent_60%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            id="contact-heading"
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
          >
            Let&apos;s Build Something
          </h2>
          <p className="text-gray-800 max-w-2xl mx-auto leading-relaxed">
            Stop compromising on speed—invite me and I&apos;ll map a clear plan to hit
            your UX and performance targets.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contactLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={
                  link.href.startsWith("mailto") || link.href.startsWith("tel:")
                    ? undefined
                    : isExternalHref(link.href)
                      ? "_blank"
                      : undefined
                }
                rel={
                  isExternalHref(link.href)
                    ? "noopener noreferrer"
                    : undefined
                }
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                style={{ transform: "translateZ(0)" }}
                className={`card-interactive flex flex-col items-center rounded-2xl border p-6 transition-[box-shadow,border-color] duration-300 hover:shadow-xl ${
                  link.primary
                    ? "border-gray-900 bg-black text-white shadow-md hover:border-gray-800"
                    : "border-gray-300 bg-white text-gray-900 shadow-sm hover:border-gray-900"
                }`}
              >
                <link.icon className="mb-3 h-8 w-8 icon-glow" aria-hidden />
                <span className="mb-1 font-semibold">{link.label}</span>
                <span
                  className={
                    link.primary
                      ? "text-sm text-gray-200"
                      : "text-center text-sm text-gray-700"
                  }
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
