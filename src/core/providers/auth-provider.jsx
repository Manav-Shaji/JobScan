'use client';

import React, { createContext, useContext } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();

  const value = {
    user: session?.user || null,
    session,
    loading: status === 'loading',
    login: async (email, password, rememberMe = false) => {
      const result = await signIn('credentials', { email, password, rememberMe, redirect: false });
      if (!result?.error) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(20);
        }
      }
      return {
        success: !result?.error,
        message: result?.error
      };
    },
    register: async (name, email, password) => {
      try {
        const res = await fetch('/api/auth/register', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        
        if (res.ok) {
          const loginResult = await signIn('credentials', { email, password, redirect: false });
          return {
            success: !loginResult?.error,
            message: loginResult?.error
          };
        }
        
        return {
          success: false,
          message: data.message || 'Registration failed'
        };
      } catch (err) {
        return {
          success: false,
          message: err.message
        };
      }
    },
    logout: async () => {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20);
      }
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('nextauth.message');
      }

      await signOut({ redirect: false });
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    },
    updateProfile: async (data) => {
      try {
        const res = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        return { success: res.ok, message: res.ok ? 'Success' : 'Update failed' };
      } catch (err) { return { success: false, message: err.message }; }
    },
    updatePassword: async (password) => {
      try {
        const res = await fetch('/api/password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });
        return { success: res.ok, message: res.ok ? 'Success' : 'Password update failed' };
      } catch (err) { return { success: false, message: err.message }; }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
