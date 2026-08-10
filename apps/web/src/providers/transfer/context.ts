import type { FileMetadata, Peer } from '@zendr/protocol';
import { createContext, useContext } from 'react';

export type Transfer = {
  requestId: string;
  direction: 'incoming' | 'outgoing';
  peerId: string;
  files: FileMetadata[];
  state: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
};

export type TransferContextValue = {
  transfers: Transfer[];
  sendRequest: (peerId: Peer['id'], fileList: FileList) => void;
};

export const TransferContext = createContext<TransferContextValue | null>(null);

export const useTransfer = () => {
  const context = useContext(TransferContext);

  if (!context) {
    throw new Error('useTransfer must be used within TransferProvider');
  }

  return context;
};
