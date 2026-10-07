/**
 * All demo (seed) data for RAYNO lives here.
 * When the backend is ready, replace these exports with API calls
 * that return the same shapes. Things the user creates in the app
 * (listings, chats, requests) live in src/lib/store.tsx instead.
 */
import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type Category = 'electronics' | 'phones' | 'fashion' | 'home' | 'vehicles' | 'property' | 'food' | 'services';

export const categories: { key: Category; label: string; icon: IconName }[] = [
  { key: 'electronics', label: 'Electronics', icon: 'tv-outline' },
  { key: 'phones', label: 'Phones', icon: 'phone-portrait-outline' },
  { key: 'fashion', label: 'Fashion', icon: 'shirt-outline' },
  { key: 'home', label: 'Home', icon: 'home-outline' },
  { key: 'vehicles', label: 'Vehicles', icon: 'car-outline' },
  { key: 'property', label: 'Property', icon: 'business-outline' },
  { key: 'food', label: 'Food', icon: 'basket-outline' },
  { key: 'services', label: 'Services', icon: 'construct-outline' },
];

export const categoryStyle: Record<Category, { icon: IconName; tint: string }> = {
  electronics: { icon: 'tv-outline', tint: '#E6F0FF' },
  phones: { icon: 'phone-portrait-outline', tint: '#E6F0FF' },
  fashion: { icon: 'shirt-outline', tint: '#FCE8F1' },
  home: { icon: 'bed-outline', tint: '#FFF1E0' },
  vehicles: { icon: 'car-sport-outline', tint: '#FDE7E7' },
  property: { icon: 'home-outline', tint: '#E3F8EC' },
  food: { icon: 'basket-outline', tint: '#FFF6D6' },
  services: { icon: 'construct-outline', tint: '#FFF6D6' },
};

export type Listing = {
  id: string;
  title: string;
  price: number;
  /** Appended after the price, e.g. "+" for "NLe 300+". */
  priceSuffix?: string;
  /** Price before a discount; listings with this set appear in Deals. */
  oldPrice?: number;
  /** A place label from src/data/locations.ts, e.g. "Lumley, Freetown". */
  location: string;
  category: Category;
  condition?: 'New' | 'Used';
  description: string;
  /** Who is selling: a Member id. */
  sellerId: string;
  /** Bundled `require(...)` or a URI. Keep photos small (~300px). Cards fall back to an icon. */
  image?: number | string;
  images?: (number | string)[];
  /** ISO date. */
  postedAt: string;
  trending?: boolean;
};

/** A seller, store or service provider. */
export type Member = {
  id: string;
  name: string;
  kind: 'store' | 'person' | 'provider';
  verified: boolean;
  rating: number;
  reviews: number;
  location: string;
  /** Year they joined RAYNO. */
  since: number;
  about: string;
  /** Service providers only. */
  trade?: string;
  availability?: 'Available Now' | 'Available Today' | 'Busy';
  priceFrom?: number;
  /** Stores only. */
  storeCategory?: string;
};

export type Message = {
  id: string;
  from: 'me' | 'them';
  text: string;
  at: string;
};

export type Conversation = {
  id: string;
  memberId: string;
  listingId?: string;
  messages: Message[];
  unread: number;
};

export type ActionCard = {
  key: 'need-it-now' | 'market' | 'services' | 'stores' | 'deals';
  title: string;
  subtitle: string;
  /** 'percent-disc' draws the white % badge used on the Deals card. */
  icon: IconName | 'percent-disc';
  color: string;
  href: '/need-it-now' | '/market' | '/services' | '/stores' | '/deals';
};

export const DEFAULT_LOCATION = 'Freetown';

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
    icon: 'construct',
    color: '#FF8A00',
    href: '/services',
  },
  {
    key: 'stores',
    title: 'Stores',
    subtitle: 'Verified Businesses',
    icon: 'storefront',
    color: '#7B3FE4',
    href: '/stores',
  },
  {
    key: 'deals',
    title: 'Deals',
    subtitle: "Today's Offers",
    icon: 'percent-disc',
    color: '#F0393C',
    href: '/deals',
  },
];

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const members: Member[] = [
  {
    id: 's1',
    name: 'Abu Electronics',
    kind: 'store',
    verified: true,
    rating: 4.9,
    reviews: 342,
    location: 'Lumley, Freetown',
    since: 2024,
    storeCategory: 'Phones & Electronics',
    about: 'Phones, TVs, laptops and accessories. Original products with warranty. Delivery within Freetown.',
  },
  {
    id: 's2',
    name: 'Freetown Home Furnishings',
    kind: 'store',
    verified: true,
    rating: 4.7,
    reviews: 128,
    location: 'Kissy, Freetown',
    since: 2024,
    storeCategory: 'Furniture & Appliances',
    about: 'Sofas, beds, fridges and home appliances. We deliver across the Western Area.',
  },
  {
    id: 's3',
    name: "Fatmata's Fashion",
    kind: 'store',
    verified: false,
    rating: 4.6,
    reviews: 57,
    location: 'Bo',
    since: 2025,
    storeCategory: 'Fashion',
    about: 'African prints, dresses and shoes for women and men. Custom tailoring available.',
  },
  {
    id: 's4',
    name: 'Kamara Motors',
    kind: 'store',
    verified: true,
    rating: 4.5,
    reviews: 89,
    location: 'Wellington, Freetown',
    since: 2024,
    storeCategory: 'Vehicles',
    about: 'Cars and motorbikes, new and foreign used. Papers checked before sale.',
  },
  {
    id: 's5',
    name: 'Makeni Mobile Hub',
    kind: 'store',
    verified: true,
    rating: 4.8,
    reviews: 73,
    location: 'Makeni',
    since: 2025,
    storeCategory: 'Phones',
    about: 'Smartphones, chargers, solar power banks and repairs in Makeni.',
  },
  {
    id: 'u1',
    name: 'Hawa Turay',
    kind: 'person',
    verified: true,
    rating: 4.8,
    reviews: 21,
    location: 'Wilberforce, Freetown',
    since: 2025,
    about: 'I rent out rooms and apartments in the west end of Freetown.',
  },
  {
    id: 'u2',
    name: 'Mohamed Bangura',
    kind: 'person',
    verified: false,
    rating: 4.4,
    reviews: 12,
    location: 'Kenema',
    since: 2025,
    about: 'Selling solar kits, generators and farm produce in Kenema.',
  },
  {
    id: 'p1',
    name: 'Alhaji Kamara',
    kind: 'provider',
    verified: true,
    rating: 4.9,
    reviews: 124,
    location: 'Freetown',
    since: 2024,
    trade: 'Electrician',
    availability: 'Available Now',
    priceFrom: 300,
    about: 'House wiring, sockets, meters and fault finding. 10 years experience.',
  },
  {
    id: 'p2',
    name: 'Susu Conteh',
    kind: 'provider',
    verified: true,
    rating: 4.8,
    reviews: 96,
    location: 'Freetown',
    since: 2024,
    trade: 'Plumber',
    availability: 'Available Today',
    priceFrom: 250,
    about: 'Leaks, taps, toilets, water tanks and pipe installation.',
  },
  {
    id: 'p3',
    name: 'Ibrahim Sesay',
    kind: 'provider',
    verified: true,
    rating: 4.7,
    reviews: 88,
    location: 'Waterloo',
    since: 2024,
    trade: 'AC Technician',
    availability: 'Available Now',
    priceFrom: 400,
    about: 'AC installation, gas refill and servicing. Fridges and freezers too.',
  },
  {
    id: 'p4',
    name: 'Mariama Kargbo',
    kind: 'provider',
    verified: false,
    rating: 4.6,
    reviews: 72,
    location: 'Freetown',
    since: 2025,
    trade: 'Cleaner',
    availability: 'Available Today',
    priceFrom: 150,
    about: 'Home and office cleaning, laundry and move-in/move-out cleaning.',
  },
  {
    id: 'p5',
    name: 'Sahr Mansaray',
    kind: 'provider',
    verified: true,
    rating: 4.7,
    reviews: 41,
    location: 'Koidu',
    since: 2025,
    trade: 'Mechanic',
    availability: 'Available Today',
    priceFrom: 300,
    about: 'Car and motorbike repairs, servicing and diagnostics in Kono.',
  },
  {
    id: 'p6',
    name: 'Isatu Koroma',
    kind: 'provider',
    verified: true,
    rating: 4.9,
    reviews: 63,
    location: 'Bo',
    since: 2025,
    trade: 'Tailor',
    availability: 'Available Now',
    priceFrom: 200,
    about: 'Dresses, suits, school uniforms and alterations.',
  },
];

export const trades = ['Electrician', 'Plumber', 'AC Technician', 'Mechanic', 'Cleaner', 'Tailor'];

export const listings: Listing[] = [
  {
    id: 'l1',
    title: 'iPhone 15 Pro Max',
    price: 24500,
    location: 'Lumley, Freetown',
    category: 'phones',
    condition: 'New',
    description: '256GB, Natural Titanium. Sealed in box with 1 year warranty. Can deliver in Freetown.',
    sellerId: 's1',
    image: require('../../assets/listings/iphone.jpg'),
    postedAt: hoursAgo(3),
  },
  {
    id: 'l2',
    title: 'Sofa Set',
    price: 8000,
    location: 'Kissy, Freetown',
    category: 'home',
    condition: 'New',
    description: 'L-shaped 5-seater sofa with ottoman. Strong wood frame, washable covers.',
    sellerId: 's2',
    image: require('../../assets/listings/sofa.jpg'),
    postedAt: hoursAgo(9),
  },
  {
    id: 'l3',
    title: 'Electrician Services',
    price: 300,
    priceSuffix: '+',
    location: 'Freetown',
    category: 'services',
    description: 'House wiring, sockets, meters and fault finding. Same-day call-outs in Freetown.',
    sellerId: 'p1',
    image: require('../../assets/listings/electrician.jpg'),
    postedAt: daysAgo(1),
  },
  {
    id: 'l4',
    title: 'Samsung TV 55"',
    price: 9800,
    oldPrice: 11500,
    location: 'Lumley, Freetown',
    category: 'electronics',
    condition: 'New',
    description: '55" 4K Smart TV with YouTube and Netflix. Wall bracket included.',
    sellerId: 's1',
    image: require('../../assets/listings/tv.jpg'),
    postedAt: daysAgo(2),
  },
  {
    id: 'l5',
    title: 'Toyota Corolla',
    price: 85000,
    location: 'Wellington, Freetown',
    category: 'vehicles',
    condition: 'Used',
    description: '2012, automatic, AC working, clean papers. Inspection welcome.',
    sellerId: 's4',
    image: require('../../assets/listings/car.jpg'),
    postedAt: daysAgo(1),
    trending: true,
  },
  {
    id: 'l6',
    title: "Women's Dresses",
    price: 350,
    priceSuffix: '+',
    location: 'Bo',
    category: 'fashion',
    condition: 'New',
    description: 'African print and ready-made dresses, all sizes. Custom orders welcome.',
    sellerId: 's3',
    image: require('../../assets/listings/dress.jpg'),
    postedAt: hoursAgo(20),
    trending: true,
  },
  {
    id: 'l7',
    title: 'Rooms for Rent',
    price: 1200,
    priceSuffix: '/mo',
    location: 'Wilberforce, Freetown',
    category: 'property',
    description: 'Self-contained rooms with water and EDSA meter. 6 months advance.',
    sellerId: 'u1',
    image: require('../../assets/listings/house.jpg'),
    postedAt: daysAgo(3),
    trending: true,
  },
  {
    id: 'l8',
    title: 'Laptops',
    price: 4500,
    priceSuffix: '+',
    oldPrice: 5200,
    location: 'Lumley, Freetown',
    category: 'electronics',
    condition: 'Used',
    description: 'HP, Dell and Lenovo laptops, Core i5/i7. Tested, with charger.',
    sellerId: 's1',
    image: require('../../assets/listings/laptop.jpg'),
    postedAt: daysAgo(2),
    trending: true,
  },
  {
    id: 'l9',
    title: 'Samsung Galaxy A15',
    price: 3200,
    oldPrice: 3600,
    location: 'Makeni',
    category: 'phones',
    condition: 'New',
    description: '128GB, dual SIM, long battery life. Comes with charger and case.',
    sellerId: 's5',
    postedAt: hoursAgo(6),
  },
  {
    id: 'l10',
    title: 'Solar Panel Kit 300W',
    price: 6500,
    oldPrice: 7400,
    location: 'Kenema',
    category: 'electronics',
    condition: 'New',
    description: '300W panel, battery, inverter and 4 bulbs. Installation available in Kenema.',
    sellerId: 'u2',
    postedAt: daysAgo(1),
    trending: true,
  },
  {
    id: 'l11',
    title: 'Generator 5kVA',
    price: 9000,
    location: 'Kenema',
    category: 'electronics',
    condition: 'Used',
    description: 'Petrol generator, runs well, recently serviced.',
    sellerId: 'u2',
    postedAt: daysAgo(4),
  },
  {
    id: 'l12',
    title: 'Refrigerator',
    price: 7500,
    oldPrice: 8200,
    location: 'Kissy, Freetown',
    category: 'home',
    condition: 'New',
    description: 'Double door fridge, low power use. Free delivery in Freetown.',
    sellerId: 's2',
    postedAt: daysAgo(2),
  },
  {
    id: 'l13',
    title: 'Bajaj Boxer Motorbike',
    price: 22000,
    location: 'Wellington, Freetown',
    category: 'vehicles',
    condition: 'New',
    description: 'Brand new Bajaj Boxer 150. Papers ready.',
    sellerId: 's4',
    postedAt: daysAgo(5),
  },
  {
    id: 'l14',
    title: 'Local Rice 50kg',
    price: 950,
    location: 'Kenema',
    category: 'food',
    description: 'Clean local rice from Kenema farms. Bulk orders welcome.',
    sellerId: 'u2',
    postedAt: hoursAgo(12),
  },
  {
    id: 'l15',
    title: "Men's Sneakers",
    price: 450,
    location: 'Bo',
    category: 'fashion',
    condition: 'New',
    description: 'Sizes 40–45. Black and white.',
    sellerId: 's3',
    postedAt: daysAgo(2),
  },
];

export const seedConversations: Conversation[] = [
  {
    id: 'c1',
    memberId: 's1',
    listingId: 'l1',
    unread: 1,
    messages: [
      { id: 'm1', from: 'me', text: 'Hello, is this still available?', at: hoursAgo(2.2) },
      { id: 'm2', from: 'them', text: "Yes, it's available.", at: hoursAgo(2.1) },
      { id: 'm3', from: 'me', text: 'Can you do NLe 24,000?', at: hoursAgo(2) },
      {
        id: 'm4',
        from: 'them',
        text: 'Yes, that works. You can come to our shop in Lumley or we can deliver.',
        at: hoursAgo(1.9),
      },
    ],
  },
  {
    id: 'c2',
    memberId: 'p1',
    unread: 0,
    messages: [
      { id: 'm5', from: 'me', text: 'My sockets are not working, can you come today?', at: daysAgo(1.1) },
      { id: 'm6', from: 'them', text: 'I can come fix it this afternoon.', at: daysAgo(1) },
    ],
  },
];

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  at: string;
  icon: IconName;
};

export const notifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Price drop',
    body: 'Samsung TV 55" is now NLe 9,800 (was NLe 11,500).',
    at: hoursAgo(1),
    icon: 'pricetag-outline',
  },
  {
    id: 'n2',
    title: 'New message',
    body: 'Abu Electronics replied to your message.',
    at: hoursAgo(1.9),
    icon: 'chatbubble-ellipses-outline',
  },
  {
    id: 'n3',
    title: 'Welcome to RAYNO',
    body: 'Buy, sell and find services anywhere in Sierra Leone.',
    at: daysAgo(2),
    icon: 'sparkles-outline',
  },
];
