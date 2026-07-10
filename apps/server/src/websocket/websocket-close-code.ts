/**
 * RFC 6455 WebSocket close status codes.
 *
 * https://datatracker.ietf.org/doc/html/rfc6455.html#section-7.4.1
 *
 * */
export enum WebSocketCloseCode {
  /** Normal closure, meaning that the purpose for which
   * the connection was established has been fulfilled. */
  NORMAL_CLOSURE = 1000,

  /** Endpoint is "going away", such as a server going down
   * or a browser having navigated away from a page. */
  GOING_AWAY = 1001,

  /** Endpoint is terminating the connection due to a protocol error. */
  PROTOCOL_ERROR = 1002,

  /** Endpoint is terminating the connection because it has received
   * a message that violates its policy. */
  POLICY_VIOLATION = 1008,

  /** Server is terminating the connection because it encountered an
   * unexpected condition that prevented it from fulfilling the request */
  INTERNAL_ERROR = 1011,
}
