import { Discovery } from './components/Discovery';
import { Header } from './components/Header';
import { SectionWrapper } from './components/SectionWrapper';
import { useResponsive } from './hooks';
import { DiscoveryProvider } from './providers/discovery';
import { PeerConnectionProvider } from './providers/peer-connection/provider';
import { ThemeProvider } from './providers/theme';
import { WebSocketProvider } from './providers/websocket';

export function App() {
  const { minMd } = useResponsive();

  return (
    <ThemeProvider>
      <WebSocketProvider>
        <DiscoveryProvider>
          <PeerConnectionProvider>
            <div className="relative flex h-full flex-col">
              <Header />
              <SectionWrapper sectionClassName="flex flex-1" className="flex flex-1 gap-10 p-5">
                <div className="flex-1">
                  <Discovery />
                </div>
                {minMd && (
                  <>
                    <div className="bg-border-hover w-px" />
                    <h2 className="text-h2 text-text-primary flex-1">Transfers</h2>
                  </>
                )}
              </SectionWrapper>
            </div>
          </PeerConnectionProvider>
        </DiscoveryProvider>
      </WebSocketProvider>
    </ThemeProvider>
  );
}
