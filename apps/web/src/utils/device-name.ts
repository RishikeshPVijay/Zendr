const astro = [
  'Atlas',
  'Nova',
  'Orion',
  'Pixel',
  'Vector',
  'Quantum',
  'Nimbus',
  'Cipher',
  'Echo',
  'Lyra',
];

const tech = [
  'Beacon',
  'Relay',
  'Node',
  'Bridge',
  'Signal',
  'Portal',
  'Core',
  'Orbit',
  'Forge',
  'Link',
];

export function generateRandomDeviceName() {
  const first = astro[Math.floor(Math.random() * astro.length)];
  const second = tech[Math.floor(Math.random() * tech.length)];
  return `${first} ${second}`;
}
