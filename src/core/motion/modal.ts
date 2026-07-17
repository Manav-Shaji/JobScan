/**
 * ------------------------------------------------------------
 * File: modal.ts
 * 
 * Purpose:
 * Modal animation variants.
 * 
 * Responsibilities:
 * • Handles scale and opacity transitions for modals
 * 
 * Used By:
 * • Dialog and Alert Components
 * ------------------------------------------------------------
 */

import { transitions } from './transitions';
import type { Variants } from 'motion/react';

const modalOverlay: Variants = {
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

const modalContent: Variants = {
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
