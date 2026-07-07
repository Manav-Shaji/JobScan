import { transitions } from './transitions';
import type { Variants } from 'motion/react';

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.springGentle
  },
  exit: { 
    opacity: 0, 
    scale: 0.98,
    transition: transitions.easeFast
  }
};
