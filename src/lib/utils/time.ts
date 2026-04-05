export function toRelativeTime(isoDate: string): string {
  const date = new Date(isoDate).getTime();
  const deltaMs = Date.now() - date;
  const deltaMinutes = Math.max(1, Math.floor(deltaMs / 60000));

  if (deltaMinutes < 60) {
    return `${deltaMinutes} min ago`;
  }

  const hours = Math.floor(deltaMinutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
