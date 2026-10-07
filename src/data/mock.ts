/**
 * All mock data for the RAYNO UI lives here.
 * When the backend is ready, replace these exports with API calls
 * that return the same shapes.
 */
import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type Listing = {
  id: string;
  title: string;
  price: number;
  /** Appended after the price, e.g. "+" for "NLe 300+". */
  priceSuffix?: string;
  location: string;
  category: 'electronics' | 'fashion' | 'home' | 'vehicles' | 'services' | 'property';
  /** Optional remote image. Keep it small (~240px). Cards show an icon tile when absent. */
  image?: string;
  icon: IconName;
  tint: string;
};

export type ActionCard = {
  key: 'need-it-now' | 'market' | 'services' | 'stores' | 'deals';
  title: string;
  subtitle: string;
  icon: IconName;
  color: string;
  href: '/need-it-now' | '/market' | '/services' | '/stores' | '/deals';
};

export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
};

export const DEFAULT_LOCATION = 'Freetown';

export const locations: string[] = [
  'Freetown',
  'Bo',
  'Kenema',
  'Makeni',
  'Koidu',
  'Port Loko',
  'Waterloo',
  'Lunsar',
];

export const actionCards: ActionCard[] = [
  {
    key: 'need-it-now',
    title: 'I Need It Now',
    subtitle: 'Get quick offers',
    icon: 'flash',
    color: '#0066FF',
    href: '/need-it-now',
  },
  {
    key: 'market',
    title: 'Market',
    subtitle: 'Buy & Sell',
    icon: 'bag-handle-outline',
    color: '#00C853',
    href: '/market',
  },
  {
    key: 'services',
    title: 'Services',
    subtitle: 'Find Professionals',
    icon: 'construct-outline',
    color: '#FF8A00',
    href: '/services',
  },
  {
    key: 'stores',
    title: 'Stores',
    subtitle: 'Verified Businesses',
    icon: 'storefront-outline',
    color: '#7B3FE4',
    href: '/stores',
  },
  {
    key: 'deals',
    title: 'Deals',
    subtitle: "Today's Offers",
    icon: 'pricetag-outline',
    color: '#F0393C',
    href: '/deals',
  },
];

export const nearYou: Listing[] = [
  {
    id: 'n1',
    title: 'iPhone 15 Pro Max',
    price: 24500,
    location: 'Freetown',
    category: 'electronics',
    icon: 'phone-portrait-outline',
    tint: '#E6F0FF',
  },
  {
    id: 'n2',
    title: 'Sofa Set',
    price: 8000,
    location: 'Freetown',
    category: 'home',
    icon: 'bed-outline',
    tint: '#FFF1E0',
  },
  {
    id: 'n3',
    title: 'Electrician Services',
    price: 300,
    priceSuffix: '+',
    location: 'Freetown',
    category: 'services',
    icon: 'flash-outline',
    tint: '#FFF6D6',
  },
  {
    id: 'n4',
    title: 'Samsung TV 55"',
    price: 9800,
    location: 'Freetown',
    category: 'electronics',
    icon: 'tv-outline',
    tint: '#E6F0FF',
  },
];

export const trendingToday: Listing[] = [
  {
    id: 't1',
    title: 'Toyota Corolla',
    price: 85000,
    location: 'Freetown',
    category: 'vehicles',
    icon: 'car-sport-outline',
    tint: '#FDE7E7',
  },
  {
    id: 't2',
    title: "Women's Dresses",
    price: 350,
    priceSuffix: '+',
    location: 'Freetown',
    category: 'fashion',
    icon: 'shirt-outline',
    tint: '#FCE8F1',
  },
  {
    id: 't3',
    title: 'Rooms for Rent',
    price: 1200,
    location: 'Freetown',
    category: 'property',
    icon: 'home-outline',
    tint: '#E3F8EC',
  },
  {
    id: 't4',
    title: 'Laptops',
    price: 4500,
    priceSuffix: '+',
    location: 'Freetown',
    category: 'electronics',
    icon: 'laptop-outline',
    tint: '#ECEFF3',
  },
];

export const conversations: Conversation[] = [
  {
    id: 'c1',
    name: 'Abu Electronics',
    lastMessage: 'Yes, that works. You can come to our shop in Freetown.',
    time: '10:29 AM',
    unread: 2,
  },
  {
    id: 'c2',
    name: 'Alhaji Kamara',
    lastMessage: 'I can come fix it this afternoon.',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: 'c3',
    name: 'Mariama Kargbo',
    lastMessage: 'Thank you! See you on Saturday.',
    time: 'Mon',
    unread: 0,
  },
];

export const currentUser = {
  name: 'Abu Kamara',
  role: 'Business Owner',
  rating: 4.9,
  reviews: 342,
  products: 486,
  views: '2.1K',
  sales: 342,
};

export const notificationCount = 3;
