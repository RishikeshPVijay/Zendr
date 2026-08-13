# Transfer Protocol

## Overview

The transfer protocol defines the messages exchanged between connected peers to manage the lifecycle of a file transfer request.

Unlike the signaling protocol, transfer messages are exchanged directly between peers over the established WebRTC data channel. The signaling server is not involved in transfer requests.

A transfer begins with a `transfer:request` message containing metadata about the files the sender wants to transfer. The receiving peer can accept or reject the request.

## Sequence diagram

```text
Initiating Peer                    Target Peer
      │                                  │
      │──── transfer:request ───────────►│
      │                                  │
      │                         Display transfer request
      │                                  │
      │◄──── transfer:accept ────────────│
      │                                  │
      │         Transfer accepted        │
      │                                  │
```

Or when rejected:

```text
Initiating Peer                    Target Peer
      │                                  │
      │──── transfer:request ───────────►│
      │                                  │
      │                         Display transfer request
      │                                  │
      │◄──── transfer:reject ────────────│
      │                                  │
      │         Transfer rejected        │
      │                                  │
```

## Messages

### transfer:request

#### Direction

Peer → Peer

#### Purpose

Requests permission to send one or more files to the target peer.

The message contains file metadata so the receiving peer can display information about the requested transfer before accepting or rejecting it. The actual file contents are not sent as part of the request.

#### Payload

```ts
{
  type: 'transfer:request';
  id: string;
  createdAt: number;
  files: FileMetadata[];
}
```

#### Fields

| Field       | Description                                             |
| ----------- | ------------------------------------------------------- |
| `id`        | Unique identifier for the transfer request.             |
| `createdAt` | Timestamp when the sender created the transfer request. |
| `files`     | Metadata of the files included in the transfer.         |

---

### transfer:accept

#### Direction

Peer → Peer

#### Purpose

Accepts a pending transfer request.

#### Payload

```ts
{
  type: 'transfer:accept';
  id: string;
}
```

#### Fields

| Field | Description                                        |
| ----- | -------------------------------------------------- |
| `id`  | Identifier of the transfer request being accepted. |

---

### transfer:reject

#### Direction

Peer → Peer

#### Purpose

Rejects a pending transfer request.

#### Payload

```ts
{
  type: 'transfer:reject';
  id: string;
}
```

#### Fields

| Field | Description                                        |
| ----- | -------------------------------------------------- |
| `id`  | Identifier of the transfer request being rejected. |

## Transfer Lifecycle

A transfer is tracked locally by each peer using its transfer ID and direction.

```ts
export type Transfer = {
  id: string;
  direction: 'incoming' | 'outgoing';
  peerId: string;
  files: FileMetadata[];
  state: 'pending' | 'accepted' | 'rejected' | 'peer-disconnected';
  createdAt: number;
};
```

The request lifecycle is:

```text
                 ┌──────────► accepted
                 │
pending ─────────┼──────────► rejected
                 │
                 └──────────► peer-disconnected

accepted ───────────────────► peer-disconnected
```

The sender creates an `outgoing` transfer in the `pending` state when sending `transfer:request`.

The receiver creates an `incoming` transfer in the `pending` state when receiving the request.

When the receiver accepts or rejects the request, the corresponding peer updates its local transfer state.

## Transport

Transfer messages are sent over the WebRTC data channel established between the peers.

```text
Peer A
  │
  │ WebRTC DataChannel
  ▼
Peer B
```
