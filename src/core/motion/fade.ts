import { transitions } from './transitions';
import type { Variants } from 'motion/react';

export const fade: Variants = {
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

export const fadeFast: Variants = {
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
