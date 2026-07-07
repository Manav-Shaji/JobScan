import type { Variants } from 'motion/react';

export const shimmer: Variants = {
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

export const pulse: Variants = {
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
