import type { Peer } from '@zendr/protocol';
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { useLocalStorage } from '../../hooks';
import { generateRandomDeviceName, getDeviceInfo, uuidv4 } from '../../utils';
import { useWebSocket } from '../websocket';
import { DiscoveryContext } from './context';
import { DiscoveryHandler } from './handler';
import { PeerRegistry } from './peer-registry';

const { browser, deviceType, os } = getDeviceInfo();

export const DiscoveryProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { connected, send, addMessageHandler } = useWebSocket();
  const [localPeer] = useLocalStorage<Peer>('device', {
    id: uuidv4(),
    deviceType,
    name: generateRandomDeviceName(),
    browser,
    os,
  });
  const peerRegistry = useMemo(() => new PeerRegistry(), []);
  const handler = useMemo(
    () => new DiscoveryHandler(peerRegistry, send, localPeer),
    [localPeer, peerRegistry, send],
  );
  const peers = useSyncExternalStore(peerRegistry.subscribe, peerRegistry.getSnapshot);

  useEffect(() => {
    if (!connected) {
      return;
    }

    handler.register();
  }, [connected, handler]);

  useEffect(() => {
    return addMessageHandler((message) => handler.handle(message));
  }, [addMessageHandler, handler]);

  return <DiscoveryContext value={{ peers, localPeer }}>{children}</DiscoveryContext>;
};
