"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MessagesSquare, ShoppingCart, Building2 } from "lucide-react";

const demos = [
  {
    label: "Forum",
    href: "https://bejewelled-torte-5871b3.netlify.app/auth",
    icon: MessagesSquare,
    ariaLabel: "Open Evangadi Forum demo",
  },
  {
    label: "Shop",
    href: "https://gregarious-malasada-9133b1.netlify.app/",
    icon: ShoppingCart,
    ariaLabel: "Open Amazon clone demo",
  },
  {
    label: "Real Estate",
    href: "https://mahi-real-estate.netlify.app/",
    icon: Building2,
    ariaLabel: "Open Mahi Real Estate demo",
  },
] as const;

export default function LiveDemos() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="demos"
      ref={ref}
      className="section-padding relative overflow-hidden"
      aria-labelledby="live-demos-heading"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url(/images/tech-abstract.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/55 to-white/65" />

      <div className="container-premium relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <h2
            id="live-demos-heading"
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
          >
            Live Demos
          </h2>
          <p className="text-gray-800 max-w-2xl mx-auto leading-relaxed">
            Featured builds—interactive products you can try in your browser.
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
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transform: "translateZ(0)" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group flex flex-1 min-w-[200px] sm:min-w-[220px] max-w-full items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white px-8 py-7 shadow-sm outline-none ring-offset-2 transition-[box-shadow,transform,border-color] duration-300 hover:border-gray-900 hover:shadow-[0_0_0_1px_rgb(23_23_23),0_20px_40px_-12px_rgb(0_0_0/0.25)] focus-visible:ring-2 focus-visible:ring-gray-900"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-md ring-2 ring-transparent transition-[transform,box-shadow] duration-300 group-hover:shadow-[0_0_24px_rgb(0_0_0/0.35)]">
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <span className="text-lg font-semibold text-gray-900">
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
