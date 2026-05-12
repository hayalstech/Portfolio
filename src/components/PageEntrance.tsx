"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

export default function PageEntrance({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {!reduce && mounted && (
        <div className="page-entrance-sheen" aria-hidden />
      )}
      <motion.div
        initial={reduce || !mounted ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduce ? 0 : 0.55,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
