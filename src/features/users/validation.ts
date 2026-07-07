import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address').optional(),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
