/**
 * ------------------------------------------------------------
 * File: stagger.ts
 * 
 * Purpose:
 * Staggered animation variants.
 * 
 * Responsibilities:
 * • Provides staggered list rendering effects
 * 
 * Used By:
 * • List and Table views
 * ------------------------------------------------------------
 */

import type { Variants } from 'motion/react';

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
};
