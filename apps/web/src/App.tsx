import { Header } from './components/Header';
import { SectionWrapper } from './components/SectionWrapper';
import { ThemeProvider } from './providers/theme';

export function App() {
  return (
    <ThemeProvider>
      <div className="flex h-full flex-col">
        <Header />
        <SectionWrapper sectionClassName="flex flex-1" className="flex flex-1 p-5">
          <h1 className="text-h1 text-text-primary flex-1">Discover Devices</h1>
          <div className="bg-border-hover w-px" />
          <h2 className="text-h2 text-text-primary flex-1">Transfers</h2>
        </SectionWrapper>
      </div>
    </ThemeProvider>
  );
}
