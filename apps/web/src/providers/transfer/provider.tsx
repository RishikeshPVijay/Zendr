import type { Peer } from '@zendr/protocol';
import type React from 'react';
import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { usePeerConnection } from '../peer-connection/context';
import { TransferContext, type Transfer } from './context';
import { TransferHandler } from './transfer-handler';
import { TransferManager } from './transfer-manager';

export const TransferProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { sendMessage, addMessageHandler, onStateChange } = usePeerConnection();
  const manager = useMemo(
    () => new TransferManager(sendMessage, onStateChange),
    [sendMessage, onStateChange],
  );
  const handler = useMemo(() => new TransferHandler(manager), [manager]);
  const transfers = useSyncExternalStore(
    manager.subscribeToTransfers,
    manager.getTransfersSnapshot,
  );

  const sendRequest = useCallback(
    (peerId: Peer['id'], fileList: FileList) => {
      manager.sendRequest(
        peerId,
        Array.from(fileList).map(({ name, type, size }) => ({
          name,
          type,
          size,
        })),
      );
    },
    [manager],
  );
  const acceptTransfer = useCallback((id: Transfer['id']) => manager.acceptTransfer(id), [manager]);
  const rejectTransfer = useCallback((id: Transfer['id']) => manager.rejectTransfer(id), [manager]);

  useEffect(() => {
    return addMessageHandler((peerId, message) => handler.handle(peerId, message));
  }, [addMessageHandler, handler]);

  return (
    <TransferContext
      value={{
        transfers,
        sendRequest,
        acceptTransfer,
        rejectTransfer,
      }}
    >
      {children}
    </TransferContext>
  );
};
