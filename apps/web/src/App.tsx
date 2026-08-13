import { Discovery } from './components/Discovery';
import { Header } from './components/Header';
import { SectionWrapper } from './components/SectionWrapper';
import { Transfers } from './components/Transfers';
import { useResponsive } from './hooks';
import { DiscoveryProvider } from './providers/discovery';
import { PeerConnectionProvider } from './providers/peer-connection/provider';
import { ThemeProvider } from './providers/theme';
import { TransferProvider } from './providers/transfer/provider';
import { WebSocketProvider } from './providers/websocket';

export function App() {
  const { minMd } = useResponsive();

  return (
    <ThemeProvider>
      <WebSocketProvider>
        <DiscoveryProvider>
          <PeerConnectionProvider>
            <TransferProvider>
              <div className="flex h-full min-h-0 flex-col">
                <Header />
                <SectionWrapper
                  sectionClassName="flex flex-1 min-h-0"
                  className="flex min-h-0 flex-1 gap-10 p-5"
                >
                  <div className="min-h-0 flex-1">
                    <Discovery />
                  </div>
                  {minMd && (
                    <>
                      <div className="bg-border-hover w-px" />
                      <div className="min-h-0 flex-1">
                        <Transfers />
                      </div>
                    </>
                  )}
                </SectionWrapper>
              </div>
            </TransferProvider>
          </PeerConnectionProvider>
        </DiscoveryProvider>
      </WebSocketProvider>
    </ThemeProvider>
  );
}
