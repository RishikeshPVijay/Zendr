import { Header } from './components/Header';
import { SectionWrapper } from './components/SectionWrapper';
import { ThemeProvider } from './providers/theme';

export function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col h-full">
        <Header />
        <SectionWrapper sectionClassName="flex flex-1" className="flex-1 p-5 flex">
          <h1 className="flex-1 text-h1 text-text-primary">Discover Devices</h1>
          <div className="bg-border-hover w-px" />
          <h2 className="flex-1 text-h2 text-text-primary">Transfers</h2>
        </SectionWrapper>
      </div>
    </ThemeProvider>
  );
}
