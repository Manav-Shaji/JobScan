'use client';

import React, { createContext, useContext, useState } from 'react';

const JobContext = createContext();

export function JobProvider({ children }) {
  const [currentJobContext, setCurrentJobContext] = useState(null);

  return (
    <JobContext.Provider value={{ currentJobContext, setCurrentJobContext }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJob() {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
}
