"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Gauge, Zap, Server, ArrowRight } from "lucide-react";

const stats = [
  { label: "API latency", value: "-50%", icon: Server },
  { label: "Server cost", value: "-30%", icon: Zap },
  { label: "MVP delivery", value: "6 weeks", icon: Gauge },
];

export default function CaseStudy() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section
      id="case-study"
      ref={ref}
      className="section-padding relative overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: 'url(/images/17973908.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/50 to-white/60" />
      
      <div className="container-premium relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-wider uppercase text-gray-900 mb-3">
            Featured case study
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-gray-900">
            Scalable SaaS rebuild with measurable speed + cost wins
          </h2>
          <p className="text-gray-800 leading-relaxed">
            The platform needed faster APIs, lower infrastructure costs, and a
            secure path from wireframes to production. I optimized data access
            + caching, modernized services, and shipped a production-ready MVP
            with performance budgets and clean architecture.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6 mb-10">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-500 mb-1">{s.label}</p>
              <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="font-semibold mb-4">What changed (technical)</h3>
            <ul className="text-sm text-gray-600 space-y-2 leading-relaxed">
              <li>- Optimized DB queries and added Redis caching.</li>
              <li>
                - Migrated a legacy monolith toward microservices/serverless to
                cut waste.
              </li>
              <li>- Delivered an end-to-end MVP with secure production rollout.</li>
            </ul>
            <div className="mt-6 text-xs text-gray-500">
              Stack: Next.js, React, Node.js, Redis, Postgres/MongoDB
            </div>
          </div>

          <div className="bg-black rounded-2xl shadow-sm p-8 text-white">
            <h3 className="font-semibold mb-4">Business impact</h3>
            <ul className="text-sm text-gray-200 space-y-2 leading-relaxed">
              <li>- 50% faster API responses via query optimization + Redis.</li>
              <li>- 30% lower server costs after architecture modernization.</li>
              <li>- Shipped a secure MVP in 6 weeks from wireframes to launch.</li>
            </ul>
            <a
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white underline underline-offset-4 hover:opacity-90"
            >
              Let’s turn your product into a scalable growth engine
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

