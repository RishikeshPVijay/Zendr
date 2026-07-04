import { ThemeProvider } from './providers/theme';

export function App() {
  return (
    <ThemeProvider>
      <h4 className="text-text-primary">Zendr</h4>
    </ThemeProvider>
  );
}
