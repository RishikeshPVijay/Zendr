export function uuidv4() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Set version to 4
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;

  // Set variant to RFC 4122
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;

  return [...bytes]
    .map(
      (b, i) =>
        (i === 4 || i === 6 || i === 8 || i === 10 ? '-' : '') + b.toString(16).padStart(2, '0'),
    )
    .join('');
}
