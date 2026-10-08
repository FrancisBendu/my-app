/**
 * Card helpers for the checkout form.
 * In the live app the card form must come from the payment partner (PCI-DSS):
 * RAYNO's servers and the phone must never store full card numbers or CVCs.
 */

export type CardBrand = 'Visa' | 'Mastercard' | 'Card';

export function cardBrand(number: string): CardBrand {
  const n = number.replace(/\D/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(n)) return 'Mastercard';
  return 'Card';
}

/** Luhn checksum: catches most typos in card numbers. */
export function isValidCardNumber(number: string): boolean {
  const digits = number.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/** "4242424242424242" -> "4242 4242 4242 4242" */
export function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

/** "0729" -> "07/29" */
export function formatExpiry(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function isValidExpiry(value: string, now = new Date()): boolean {
  const m = value.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth >= now;
}

/** Sierra Leone mobile numbers: 8 digits after the leading 0 (e.g. 076 123 456), or +232 and 8 digits. */
export function isValidSlPhone(value: string): boolean {
  const d = value.replace(/\D/g, '');
  return /^0\d{8}$/.test(d) || /^232\d{8}$/.test(d) || /^\d{8}$/.test(d);
}
