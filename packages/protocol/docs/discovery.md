# Discovery Protocol

## Overview

The discovery protocol enables clients connected to the same signaling server to discover other online devices.

## Sequence diagram

```text
New Client                      Signaling Server                Existing Clients
     │                                  │                                │
     │── discovery:register ──────────► │                                │
     │                                  │                                │
     │ ◄──────── discovery:list ─────── │                                │
     │                                  │                                │
     │                                  ├── discovery:joined ───────────►│
     │                                  │                                │
     │                                  │
     X Connection closed                │
                                        │
                                        ├── discovery:left ─────────────►│
                                        │
```

## Messages

### discovery:register

#### Direction

Client → Server

#### Purpose

Registers a client with the signaling server.

#### Payload

```ts
{
  type: "discovery:register",
  id: string;
  name: string;
  deviceType: "mobile" | "tablet" | "desktop" | "tv" | "unknown";
}
```

### discovery:list

#### Direction

Server → Client

#### Purpose

Sent to a newly registered client the complete list of peers currently connected to the signaling server.

#### Payload

```ts
{
  type: 'discovery:list';
  peers: {
    id: string;
    name: string;
    deviceType: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'unknown';
  }
  [];
}
```

### discovery:joined

#### Direction

Server → All connected clients (except the newly joined client)

#### Purpose

Notifies clients that a new peer has joined the signaling server and should be added to discovered peer list.

#### Payload

```ts
{
  type: 'discovery:list';
  peers: {
    id: string;
    name: string;
    deviceType: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'unknown';
  }
}
```

### discovery:left

#### Direction

Server → Remaining connected clients

#### Purpose

Notifies clients that a peer has disconnected and should be removed from the discovered peer list.

#### Payload

```ts
{
  type: 'discovery:list';
  peerId: string;
}
```
