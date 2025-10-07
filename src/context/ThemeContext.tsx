
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';
export type ThemeSize = 'normal' | 'large' | 'touch-friendly';

interface ThemeContextType {
  mode: ThemeMode;
  size: ThemeSize;
  setMode: (mode: ThemeMode) => void;
  setSize: (size: ThemeSize) => void;
  isMobile: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [size, setSize] = useState<ThemeSize>('normal');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'high-contrast', 'normal', 'large', 'touch-friendly');
    
    // Add current theme classes
    root.classList.add(mode, size);
    
    // Save preferences
    localStorage.setItem('theme-mode', mode);
    localStorage.setItem('theme-size', size);
  }, [mode, size]);

  useEffect(() => {
    // Load saved preferences
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    const savedSize = localStorage.getItem('theme-size') as ThemeSize;
    
    if (savedMode && ['light', 'dark', 'high-contrast'].includes(savedMode)) {
      setMode(savedMode);
    }
    
    if (savedSize && ['normal', 'large', 'touch-friendly'].includes(savedSize)) {
      setSize(savedSize);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, size, setMode, setSize, isMobile }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
