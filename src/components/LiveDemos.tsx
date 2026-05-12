"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ShoppingCart, Building2 } from "lucide-react";

const demos = [
  {
    label: "Campus Gig",
    href: "https://extraordinary-praline-f7b13c.netlify.app/",
    icon: Building2,
    ariaLabel: "Open Campus Gig project",
  },
  {
    label: "Apple Clone",
    href: "https://gleaming-lamington-621f64.netlify.app/",
    icon: ShoppingCart,
    ariaLabel: "Open Apple Clone project",
  },
  {
    label: "Real Estate",
    href: "https://mahi-real-estate.netlify.app/",
    icon: Building2,
    ariaLabel: "Open Mahi Real Estate project",
  },
  {
    label: "Shop",
    href: "https://gregarious-malasada-9133b1.netlify.app/",
    icon: ShoppingCart,
    ariaLabel: "Open Amazon clone project",
  },
] as const;

export default function LiveDemos() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="projects"
      ref={ref}
      className="section-padding relative overflow-hidden"
      aria-labelledby="projects-heading"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url(/images/pexels-alex-dos-santos-305643819-26172887.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-blue-900/70 to-indigo-900/80" />

      <div className="container-premium relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Projects
          </h2>
          <p className="text-gray-200 max-w-2xl mx-auto">
            Explore my live projects demonstrating full-stack development skills
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-5 md:gap-8 max-w-3xl mx-auto">
          {demos.map((demo, index) => {
            const Icon = demo.icon;
            return (
              <motion.a
                key={demo.label}
                href={demo.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={demo.ariaLabel}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
                style={{ transform: "translateZ(0)" }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group card-interactive flex flex-1 min-w-[200px] sm:min-w-[220px] max-w-full items-center justify-center gap-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm px-8 py-7 shadow-sm outline-none ring-offset-2 transition-[box-shadow,transform,border-color] duration-300 hover:border-white/40 hover:bg-white/15 hover:shadow-[0_0_0_1px_rgb(255_255_255),0_20px_40px_-12px_rgb(0_0_0/0.25)] focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md ring-2 ring-transparent transition-[transform,box-shadow] duration-300 group-hover:shadow-[0_0_24px_rgb(124_77_255/0.35)]">
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <span className="text-lg font-semibold text-white">
                  {demo.label}
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
