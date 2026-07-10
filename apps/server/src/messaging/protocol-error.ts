export class ProtocolError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
