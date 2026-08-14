import { AppContent } from './components/AppContent';
import { DiscoveryProvider } from './providers/discovery';
import { PeerConnectionProvider } from './providers/peer-connection/provider';
import { ThemeProvider } from './providers/theme';
import { TransferProvider } from './providers/transfer/provider';
import { WebSocketProvider } from './providers/websocket';

export function App() {
  return (
    <ThemeProvider>
      <WebSocketProvider>
        <DiscoveryProvider>
          <PeerConnectionProvider>
            <TransferProvider>
              <AppContent />
            </TransferProvider>
          </PeerConnectionProvider>
        </DiscoveryProvider>
      </WebSocketProvider>
    </ThemeProvider>
  );
}
