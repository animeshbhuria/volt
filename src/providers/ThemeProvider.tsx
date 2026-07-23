import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from '@/theme/tokens';

type ThemeContextProps = {
  theme: Theme;
  scheme: ColorSchemeName;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceScheme = Appearance.getColorScheme() ?? 'light';
  const [scheme, setScheme] = useState<ColorSchemeName>(deviceScheme);

  // Load persisted theme on mount
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('themeScheme');
      if (saved === 'dark' || saved === 'light') setScheme(saved);
    })();
  }, []);

  const toggleTheme = () => {
    const newScheme = scheme === 'dark' ? 'light' : 'dark';
    setScheme(newScheme);
    AsyncStorage.setItem('themeScheme', newScheme);
  };

  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, scheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
