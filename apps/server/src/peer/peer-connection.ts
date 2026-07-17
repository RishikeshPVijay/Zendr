import type { Peer } from '@zendr/protocol';
import type { ClientSession } from '../session/client-session.js';

export interface PeerConnection {
  peer: Peer;
  session: ClientSession;
}
