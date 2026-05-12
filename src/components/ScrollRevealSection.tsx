"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function ScrollRevealSection({ children, className }: Props) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      animate={
        reduce
          ? { opacity: 1, y: 0 }
          : isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 28 }
      }
      transition={{
        duration: reduce ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: reduce ? undefined : "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
