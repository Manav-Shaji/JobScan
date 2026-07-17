/**
 * ------------------------------------------------------------
 * File: fade.ts
 * 
 * Purpose:
 * Fade animation variants.
 * 
 * Responsibilities:
 * • Provides simple opacity fade in/out effects
 * 
 * Used By:
 * • General UI Components
 * ------------------------------------------------------------
 */

import { transitions } from './transitions';
import type { Variants } from 'motion/react';

const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.easeNormal
  },
  exit: { 
    opacity: 0,
    transition: transitions.easeFast
  }
};

const fadeFast: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.easeFast
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.1 }
  }
};
