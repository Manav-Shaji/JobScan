/**
 * ------------------------------------------------------------
 * File: slide.ts
 * 
 * Purpose:
 * Slide animation variants.
 * 
 * Responsibilities:
 * • Provides slide-in/out transitions
 * 
 * Used By:
 * • Dialogs and Drawers
 * ------------------------------------------------------------
 */

import { transitions } from './transitions';
import type { Variants } from 'motion/react';

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.springSnappy
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: transitions.easeFast
  }
};

const slideDown: Variants = {
  hidden: { opacity: 0, y: -15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.springSnappy
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: transitions.easeFast
  }
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.springGentle
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: transitions.easeFast
  }
};
