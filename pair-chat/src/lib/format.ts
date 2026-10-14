/** "10:29" for today, otherwise "Yesterday" / a date. */
export function chatTime(iso: string): string {
  const date = new Date(iso);
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days < 1) {
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString();
}

/** First one or two initials of a name, for an avatar. */
export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
