import { transitions } from './transitions';
import type { Variants } from 'motion/react';

export const modalOverlay: Variants = {
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

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: transitions.springGentle
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: transitions.easeFast
  }
};
