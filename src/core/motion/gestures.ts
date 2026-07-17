/**
 * ------------------------------------------------------------
 * File: gestures.ts
 * 
 * Purpose:
 * Framer motion gesture configurations.
 * 
 * Responsibilities:
 * • Defines standard hover and tap animations
 * • Ensures consistent interactive feedback
 * 
 * Used By:
 * • UI Components
 * ------------------------------------------------------------
 */

import { transitions } from './transitions';

export const buttonGestures = {
  whileHover: { scale: 1.02, transition: transitions.easeFast },
  whileTap: { scale: 0.98, transition: transitions.easeFast }
};

export const cardGestures = {
  whileHover: { y: -2, transition: transitions.easeFast },
  whileTap: { scale: 0.99, transition: transitions.easeFast }
};
