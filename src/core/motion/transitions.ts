/**
 * ------------------------------------------------------------
 * File: transitions.ts
 * 
 * Purpose:
 * Common transition configurations.
 * 
 * Responsibilities:
 * • Standardizes animation springs and easings
 * 
 * Used By:
 * • All Motion Variants
 * ------------------------------------------------------------
 */

import type { Transition } from 'motion/react';

export const transitions: Record<string, Transition> = {
  // Snappy spring for layout changes and small elements
  springSnappy: {
    type: "spring",
    stiffness: 400,
    damping: 30,
  },
  // Gentle spring for modals and cards
  springGentle: {
    type: "spring",
    stiffness: 200,
    damping: 20,
  },
  // Fast ease for hovers and micro-interactions
  easeFast: {
    type: "tween",
    ease: "easeOut",
    duration: 0.15,
  },
  // Standard ease for page transitions and reveals
  easeNormal: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  },
  // Slow ease for deliberate entrances
  easeSlow: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.5,
  },
};
