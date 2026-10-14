/** Tether's look: a warm violet identity for a private, two-person space. */
export const colors = {
  primary: '#6C3CE0',
  primarySoft: '#F0ECFA',
  accent: '#FF5C8A',
  text: '#1C1430',
  textMuted: '#6E6880',
  bg: '#FFFFFF',
  surface: '#F7F5FC',
  border: '#E8E4F2',
  white: '#FFFFFF',
  mineBubble: '#6C3CE0',
  mineText: '#FFFFFF',
  theirsBubble: '#F0ECFA',
  danger: '#E23D5A',
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const shadows = {
  soft: { boxShadow: '0px 2px 10px rgba(28, 20, 48, 0.08)' },
} as const;
