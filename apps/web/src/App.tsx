import { Header } from './components/Header';
import { SectionWrapper } from './components/SectionWrapper';
import { ThemeProvider } from './providers/theme';

export function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col h-full">
        <Header />
        <SectionWrapper sectionClassName="flex flex-1" className="flex-1 p-5 flex">
          <h2 className="flex-1 text-text-primary">Discover Devices</h2>
          <div className="bg-border-hover w-px" />
          <h3 className="flex-1 text-text-primary">Transfers</h3>
        </SectionWrapper>
      </div>
    </ThemeProvider>
  );
}
