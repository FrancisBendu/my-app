import type { Order, PaymentMethod } from './store';
import { colors } from './theme';

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  orange: 'Orange Money',
  afrimoney: 'Afrimoney',
  card: 'Bank card',
  cash: 'Cash on delivery',
};

export const STATUS_COLOR: Record<Order['status'], string> = {
  'Paid · protected': colors.primary,
  'Pay on delivery': colors.orange,
  Received: colors.green,
  'Problem reported': colors.red,
};
