/**
 * ------------------------------------------------------------
 * File: loading.ts
 * 
 * Purpose:
 * Loading animation variants.
 * 
 * Responsibilities:
 * • Provides pulsing and spinning effects
 * 
 * Used By:
 * • Loaders and Skeletons
 * ------------------------------------------------------------
 */

import type { Variants } from 'motion/react';

const shimmer: Variants = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      repeat: Infinity,
      ease: "linear",
      duration: 1.5,
    },
  },
};

const pulse: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
      duration: 0.8,
    },
  },
};
