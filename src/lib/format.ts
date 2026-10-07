/**
 * Formats an amount in Sierra Leonean New Leones, e.g. 24500 -> "NLe 24,500".
 * Avoids Intl so it behaves the same on every Android/Hermes build.
 */
export function formatNLe(amount: number, suffix = ''): string {
  const whole = Math.round(amount).toString();
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `NLe ${withCommas}${suffix}`;
}

/** "Just now", "5 min ago", "3 h ago", "Yesterday", "4 days ago", then a date. */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'Yesterday';
  if (d < 7) return `${d} days ago`;
  return new Date(iso).toLocaleDateString();
}

/** "10:29" for today, otherwise "Yesterday" / weekday / date. Used in chat lists. */
export function chatTime(iso: string): string {
  const date = new Date(iso);
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days < 1) {
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }
  if (days === 1) return 'Yesterday';
  return timeAgo(iso);
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
