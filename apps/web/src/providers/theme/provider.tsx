import { useEffect } from 'react';
import { useLocalStorage } from '../../hooks';
import type { Theme } from '../../types/app';
import { ThemeContext } from './context';

const getNextTheme = (theme: Theme | null) => {
  switch (theme) {
    case null:
      return 'light';
    case 'light':
      return 'dark';
    case 'dark':
      return 'system';
    case 'system':
      return 'light';
  }
};

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const applyTheme = (theme: Theme) => {
  let activeTheme: Theme = theme;

  if (theme === 'system') {
    activeTheme = mediaQuery.matches ? 'dark' : 'light';
  }

  document.documentElement.dataset.theme = activeTheme;
};

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme | null>('theme', null);

  useEffect(() => {
    const handler = () => {
      applyTheme(theme ?? 'system');
    };

    mediaQuery.addEventListener('change', handler);

    handler();
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const theme = getNextTheme(prevTheme);
      applyTheme(theme);
      return theme === 'system' ? null : theme;
    });
  };

  return <ThemeContext value={{ theme: theme ?? 'system', toggleTheme }}>{children}</ThemeContext>;
};
