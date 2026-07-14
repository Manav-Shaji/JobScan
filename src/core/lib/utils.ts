/**
 * ------------------------------------------------------------
 * File: utils.ts
 * 
 * Purpose:
 * Generic utility functions for the application.
 * 
 * Responsibilities:
 * • Provide Tailwind class merging utility (cn)
 * 
 * Used By:
 * • UI Components
 * ------------------------------------------------------------
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
