import { transitions } from './transitions';
import type { Variants } from 'motion/react';

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.easeNormal
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.easeFast
  }
};
