/**
 * Formats an amount in Sierra Leonean New Leones, e.g. 24500 -> "NLe 24,500".
 * Avoids Intl so it behaves the same on every Android/Hermes build.
 */
export function formatNLe(amount: number, suffix = ''): string {
  const whole = Math.round(amount).toString();
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `NLe ${withCommas}${suffix}`;
}
