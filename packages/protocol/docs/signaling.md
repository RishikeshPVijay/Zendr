# Signaling Protocol

## Overview

The signaling protocol enables peers to exchange WebRTC negotiation messages through the signaling server in order to establish a direct peer-to-peer connection.

The signaling server treats SDP and ICE candidate payloads as opaque data and forwards them without inspection.

## Sequence diagram

```text
Initiating Client              Signaling Server               Target Client
       │                                │                             │
       │── signaling:offer ───────────► │                             │
       │                                ├── signaling:offer ─────────►│
       │                                │                             │
       │                                │◄──────── signaling:answer ──│
       │◄──── signaling:answer ─────────┤                             │
       │                                │                             │
       │── signaling:ice-candidate ───► │                             │
       │                                ├── signaling:ice-candidate ─►│
       │                                │                             │
       │                                │◄── signaling:ice-candidate ─│
       │◄── signaling:ice-candidate ────┤                             │
```

## Messages

### signaling:offer

#### Purpose

Carries a WebRTC SDP offer from one peer to another to initiate connection negotiation.

#### Payload

```ts
{
  type: 'signaling:offer';
  targetPeerId: string;
  sdp: string;
}
```

---

### signaling:answer

#### Purpose

Carries a WebRTC SDP answer in response to an SDP offer.

#### Payload

```ts
{
  type: 'signaling:answer';
  targetPeerId: string;
  sdp: string;
}
```

---

### signaling:ice-candidate

#### Purpose

Carries an ICE candidate discovered during the WebRTC negotiation process.

#### Payload

```ts
{
  type: 'signaling:ice-candidate';
  targetPeerId: string;
  candidate: string;
}
```
