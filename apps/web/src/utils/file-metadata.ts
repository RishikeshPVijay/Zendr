import type { FileMetadata } from '@zendr/protocol';

const units = ['B', 'KB', 'MB', 'GB'] as const;

const formatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
});

export function getFormattedTotalSize(files: FileMetadata[]) {
  let size = files.reduce((total, file) => total + file.size, 0);
  let unitIndex = 0;

  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000;
    unitIndex++;
  }

  return `${formatter.format(size)} ${units[unitIndex]}`;
}
