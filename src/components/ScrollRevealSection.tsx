"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function ScrollRevealSection({ children, className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce || !mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      animate={
        reduce || !mounted
          ? { opacity: 1, y: 0 }
          : isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 28 }
      }
      transition={{
        duration: reduce ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      style={{ willChange: reduce ? undefined : "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
