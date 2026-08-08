import type { Candidate, ClientSignalingMessage, Peer } from '@zendr/protocol';

type SendFunction = (message: ClientSignalingMessage) => void;
type StateChangeCallback = (state: RTCPeerConnectionState) => void;

export class PeerConnection {
  private readonly connection = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  });
  private dataChannel?: RTCDataChannel;
  private readonly peerId;
  private readonly send: SendFunction;

  constructor(peerId: Peer['id'], send: SendFunction, onStateChange: StateChangeCallback) {
    this.peerId = peerId;
    this.send = send;

    this.connection.onconnectionstatechange = () => {
      onStateChange(this.connection.connectionState);
    };

    this.connection.onicecandidate = (event) => {
      if (!event.candidate) {
        return;
      }

      this.send({
        type: 'signaling:ice-candidate',
        targetPeerId: this.peerId,
        candidate: event.candidate,
      });
    };

    this.connection.ondatachannel = (event) => {
      this.setupDataChannel(event.channel);
    };

    //this.connection.onicegatheringstatechange = () => {
    //  console.log('[ICE Gathering]', this.connection.iceGatheringState);
    //};

    //this.connection.oniceconnectionstatechange = () => {
    //  this.iceConnectionState = this.connection.iceConnectionState;
    //};

    //this.connection.onsignalingstatechange = () => {
    //  this.signalingState = this.connection.signalingState;
    //};
  }

  private setupDataChannel(channel: RTCDataChannel) {
    this.dataChannel = channel;

    this.dataChannel.onopen = () => {
      console.log('Data channel open');
    };

    this.dataChannel.onmessage = (event) => {
      console.log(event.data);
    };

    this.dataChannel.onclose = () => {
      console.log('Data channel closed');
    };
  }

  async createOffer() {
    if (this.connection.connectionState !== 'new') {
      return;
    }

    const dataChannel = this.connection.createDataChannel('zendr');
    this.setupDataChannel(dataChannel);

    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);

    this.send({
      type: 'signaling:offer',
      targetPeerId: this.peerId,
      sdp: this.connection.localDescription!.sdp!,
    });
  }

  async handleOffer(sdp: string) {
    await this.connection.setRemoteDescription({ type: 'offer', sdp });

    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);

    this.send({
      type: 'signaling:answer',
      targetPeerId: this.peerId,
      sdp: this.connection.localDescription!.sdp!,
    });
  }

  async handleAnswer(sdp: string) {
    await this.connection.setRemoteDescription({
      type: 'answer',
      sdp,
    });
  }

  async handleIceCandidate(candidate: Candidate) {
    await this.connection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  destroy() {
    this.connection.onconnectionstatechange = null;
    this.connection.oniceconnectionstatechange = null;
    this.connection.onsignalingstatechange = null;
    this.connection.onicecandidate = null;
    this.connection.ondatachannel = null;

    this.dataChannel?.close();
    this.connection.close();
  }
}
