import { findPlace } from '@/data/locations';

export type DeliveryQuote = { fee: number; days: string; label: string };

/**
 * Demo delivery prices. Replace with real rates from delivery partners.
 * Same district: rider delivery. Same region: bus/park delivery. Elsewhere: courier.
 */
export function deliveryQuote(from: string, to: string): DeliveryQuote {
  const a = findPlace(from);
  const b = findPlace(to);
  if (!a || !b || a.district === b.district) return { fee: 50, days: '1–2 days', label: 'Rider delivery' };
  if (a.region === b.region) return { fee: 100, days: '2–3 days', label: 'Delivery within region' };
  return { fee: 150, days: '3–5 days', label: 'Courier across Sierra Leone' };
}
